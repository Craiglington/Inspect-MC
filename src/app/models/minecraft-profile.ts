export interface MinecraftPlayerProfile {
  meta: {
    cached_at: number;
  };
  username: string;
  id: string;
  raw_id: string;
  avatar: string;
  skin_texture: string;
}

export interface MinecraftProfileResponse {
  code: string;
  message: string;
  success: boolean;
  data: {
    player: MinecraftPlayerProfile;
  };
}
