import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, EMPTY, Observable } from "rxjs";
import { MinecraftProfileResponse } from "../../models/minecraft-profile";

@Injectable({
  providedIn: "root"
})
export class MinecraftProfileService {
  private static readonly PROFILE_URL = "/minecraft/profile/";

  private readonly http = inject(HttpClient);

  getProfile(uuid: string): Observable<MinecraftProfileResponse> {
    return this.http.get<MinecraftProfileResponse>(
      `${MinecraftProfileService.PROFILE_URL}${uuid}`
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
