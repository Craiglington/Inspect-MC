export interface MojangProfile {
  id: string;
  name: string;
  properties: { name: string; value: string }[];
}

export interface MojangTexture {
  timestamp: number;
  profileId: string;
  profileName: string;
  textures: {
    SKIN: {
      url: string;
      metadata?: {
        model: string;
      };
    };
    CAPE?: {
      url: string;
    };
  };
}
