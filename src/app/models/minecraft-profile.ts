export interface MinecraftProfile {
  code: string;
  message: string;
  success: boolean;
  data: {
    player: {
      meta: {
        cached_at: number;
      };
      username: string;
      id: string;
      raw_id: string;
      avatar: string;
      skin_texture: string;
    };
  };
}
