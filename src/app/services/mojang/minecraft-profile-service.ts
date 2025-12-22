import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, EMPTY, Observable } from "rxjs";
import { MinecraftProfile } from "../../models/minecraft-profile";

@Injectable({
  providedIn: "root"
})
export class MinecraftProfileService {
  private static readonly PROFILE_URL = "/minecraft/profile/";

  private readonly http = inject(HttpClient);

  getProfile(uuid: string): Observable<MinecraftProfile> {
    return this.http.get<MinecraftProfile>(
      `${MinecraftProfileService.PROFILE_URL}${uuid}`
    );
  }

  getSkinTexture(profile: MinecraftProfile): Observable<Blob> {
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
