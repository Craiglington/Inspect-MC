import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, EMPTY, Observable, of, tap } from "rxjs";
import { MinecraftProfileResponse } from "../../models/minecraft-profile";

@Injectable({
  providedIn: "root"
})
export class MinecraftProfileService {
  private readonly http = inject(HttpClient);

  private static readonly PROFILE_URL = "/minecraft/profile/";
  private readonly profiles: Map<string, MinecraftProfileResponse> = new Map();

  /**
   * Fetches a Minecraft profile if not already stored given the profile's uuid.
   */
  getProfile(uuid: string): Observable<MinecraftProfileResponse> {
    const profile = this.profiles.get(uuid);
    if (profile) return of(profile);
    console.log(uuid);
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
