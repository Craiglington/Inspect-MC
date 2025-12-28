import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule
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
import { FileInput } from "../../file-input/file-input";
import {
  StatsDialogForm,
  StatsDialogInputData,
  StatsDialogOutputData
} from "../../../models/stats-dialog-data";
import {
  MinecraftPlayerProfile,
  MinecraftProfileResponse
} from "../../../models/minecraft-profile";
import { MinecraftProfileService } from "../../../services/minecraft-profile/minecraft-profile-service";
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
import { NotificationService } from "../../../services/notification/notification-service";

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

  private readonly data = inject<StatsDialogInputData>(MAT_DIALOG_DATA);
  private readonly $profiles = new Subject<
    Observable<MinecraftProfileResponse[]>
  >();
  protected files?: FileList;

  profiles!: Map<string, MinecraftPlayerProfile>;
  formGroup!: FormGroup<StatsDialogForm>;

  ngOnInit(): void {
    this.profiles = this.data.profiles;
    this.formGroup = this.formBuilder.group({
      activeProfiles: new FormControl<string[]>(
        { value: this.data.activeProfiles, disabled: !this.profiles.size },
        {
          nonNullable: true
        }
      )
    });

    this.$profiles
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
        for (const profile of newProfiles) {
          if (!profile.success) continue;
          this.profiles.set(profile.data.player.id, profile.data.player);
        }
      });
  }

  ngOnDestroy(): void {
    this.$profiles.unsubscribe();
  }

  filesUploaded(files: FileList) {
    this.files = files;
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
      profileObservables.push(
        this.minecraftProfileService.getProfile(regexResult.groups["uuid"])
      );
    }
    this.$profiles.next(forkJoin(profileObservables));
  }

  getOutputData(): StatsDialogOutputData {
    return {
      ...this.formGroup.getRawValue(),
      profiles: this.profiles,
      files: this.files
    };
  }
}
