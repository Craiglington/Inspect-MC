import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import {
  catchError,
  EMPTY,
  finalize,
  forkJoin,
  Observable,
  Subject,
  switchMap,
  timeout
} from "rxjs";
import {
  MinecraftPlayerProfile,
  MinecraftProfileResponse
} from "../../../models/minecraft-profile";
import { StatsCategory } from "../../../models/stats";
import { MinecraftProfileService } from "../../../services/minecraft-profile/minecraft-profile-service";
import { NotificationService } from "../../../services/notification/notification-service";
import { FileInput } from "../../file-input/file-input";

export interface StatsDialogInputData {
  profiles: Map<string, MinecraftPlayerProfile>;
  activeProfiles: string[];
  statsCategory: StatsCategory;
}

export interface StatsDialogOutputData extends StatsDialogInputData {
  files?: Map<string, File>;
}

export interface StatsDialogForm {
  activeProfiles: FormControl<string[]>;
  statsCategory: FormControl<StatsCategory>;
}

@Component({
  selector: "app-stats-dialog",
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    MatSelectModule,
    FileInput
  ],
  templateUrl: "./stats-dialog.html",
  styleUrl: "./stats-dialog.scss"
})
export class StatsDialogComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly minecraftProfileService = inject(MinecraftProfileService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialogData = inject<StatsDialogInputData>(MAT_DIALOG_DATA);

  protected readonly statsCategoryOptions: {
    text: string;
    value: StatsCategory;
  }[] = [
    {
      text: "Broken",
      value: "minecraft:broken"
    },
    {
      text: "Crafted",
      value: "minecraft:crafted"
    },
    {
      text: "Dropped",
      value: "minecraft:dropped"
    },
    {
      text: "General",
      value: "minecraft:custom"
    },
    {
      text: "Killed",
      value: "minecraft:killed"
    },
    {
      text: "Killed By",
      value: "minecraft:killed_by"
    },
    {
      text: "Mined",
      value: "minecraft:mined"
    },

    {
      text: "Picked Up",
      value: "minecraft:picked_up"
    },
    {
      text: "Used",
      value: "minecraft:used"
    }
  ];

  private readonly profiles$ = new Subject<
    Observable<MinecraftProfileResponse[]>
  >();
  protected files!: Map<string, File>;
  protected profiles!: Map<string, MinecraftPlayerProfile>;
  protected formGroup!: FormGroup<StatsDialogForm>;

  ngOnInit(): void {
    this.files = new Map();
    this.profiles = this.dialogData.profiles;
    this.formGroup = this.formBuilder.group({
      activeProfiles: new FormControl<string[]>(
        {
          value: this.dialogData.activeProfiles,
          disabled: !this.profiles.size
        },
        {
          nonNullable: true
        }
      ),
      statsCategory: new FormControl(this.dialogData.statsCategory, {
        nonNullable: true,
        validators: Validators.required
      })
    });

    this.profiles$
      .pipe(
        switchMap((newProfiles) =>
          newProfiles.pipe(
            timeout(30000),
            catchError((error) => {
              console.error(error);
              this.notificationService.notify({
                message: "Failed to load Minecraft profiles."
              });
              return EMPTY;
            }),
            finalize(() => {
              if (this.profiles.size) {
                this.formGroup.controls.activeProfiles.enable();
              }
            })
          )
        )
      )
      .subscribe((newProfiles) => {
        const sortedProfiles = newProfiles
          .filter((profile) => profile.success)
          .sort((a, b) => {
            if (a.data.player.username < b.data.player.username) {
              return -1;
            }
            if (a.data.player.username > b.data.player.username) {
              return 1;
            }
            return 0;
          });
        for (const profile of sortedProfiles) {
          this.profiles.set(profile.data.player.id, profile.data.player);
        }
      });
  }

  ngOnDestroy(): void {
    this.profiles$.unsubscribe();
  }

  filesUploaded(files: FileList) {
    this.files.clear();
    this.profiles.clear();
    this.formGroup.controls.activeProfiles.setValue([]);
    this.formGroup.controls.activeProfiles.disable();
    const statsRegex = new RegExp(
      /^(?<uuid>[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})\.json$/
    );
    const profileObservables: Observable<MinecraftProfileResponse>[] = [];
    for (const file of files) {
      const regexResult = statsRegex.exec(file.name);
      if (!regexResult || !regexResult.groups) continue;
      const uuid = regexResult.groups["uuid"];
      this.files.set(uuid, file);
      profileObservables.push(this.minecraftProfileService.getProfile(uuid));
    }
    this.profiles$.next(forkJoin(profileObservables));
  }

  getOutputData(): StatsDialogOutputData {
    return {
      ...this.formGroup.getRawValue(),
      profiles: this.profiles,
      files: this.files.size ? this.files : undefined
    };
  }
}
