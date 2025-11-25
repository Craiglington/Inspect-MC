import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, EMPTY, Observable } from "rxjs";
import { MojangProfile, MojangTexture } from "../../models/mojang-profile";

@Injectable({
  providedIn: "root"
})
export class MojangService {
  private static readonly PROFILE_URL = "/mojang/session/minecraft/profile/";

  private readonly http = inject(HttpClient);

  getProfile(uuid: string): Observable<MojangProfile> {
    return this.http.get<MojangProfile>(`${MojangService.PROFILE_URL}${uuid}`);
  }

  getSkinTexture(profile: MojangProfile): Observable<Blob> {
    for (const property of profile.properties) {
      if (property.name === "textures") {
        const texturesObject = JSON.parse(
          atob(property.value)
        ) as MojangTexture;
        return this.http
          .get(texturesObject.textures.SKIN.url, {
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
    return EMPTY;
  }
}
