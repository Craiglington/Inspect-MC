import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import {
  catchError,
  EMPTY,
  forkJoin,
  map,
  Observable,
  of,
  tap,
  throwError,
  timeout
} from "rxjs";
import { MinecraftProfileResponse } from "../../models/minecraft-profile";

@Injectable({
  providedIn: "root"
})
export class MinecraftProfileService {
  private readonly http = inject(HttpClient);

  private static readonly PROFILE_URL =
    "https://playerdb.co/api/player/minecraft/";
  private readonly profiles: Map<string, MinecraftProfileResponse> = new Map();

  /**
   * Fetches a Minecraft profile if not already stored given the profile's uuid.
   */
  getProfile(uuid: string): Observable<MinecraftProfileResponse> {
    const profile = this.profiles.get(uuid);
    if (profile) return of(profile);
    return this.http
      .get<MinecraftProfileResponse>(
        `${MinecraftProfileService.PROFILE_URL}${uuid}`
      )
      .pipe(
        tap((response) => {
          if (
            response.success ||
            response.code === "minecraft.invalid_username"
          ) {
            this.profiles.set(uuid, response);
          }
        })
      );
  }

  getSortedProfiles(uuids: string[]): Observable<MinecraftProfileResponse[]> {
    if (uuids.length > 100) {
      return throwError(
        () => "Too many Minecraft profiles requested at one time."
      );
    }
    const profileObservables: Observable<MinecraftProfileResponse>[] = [];
    for (const uuid of uuids) {
      profileObservables.push(this.getProfile(uuid));
    }
    return forkJoin(profileObservables).pipe(
      timeout(30000),
      map((profiles) => {
        return profiles
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
      })
    );
  }

  getSkinTexture(profile: MinecraftProfileResponse): Observable<Blob> {
    return this.http
      .get(profile.data.player.skin_texture, {
        responseType: "blob"
      })
      .pipe(
        catchError((error) => {
          console.error(error);
          return EMPTY;
        })
      );
  }
}
