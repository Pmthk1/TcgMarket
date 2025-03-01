export type Database = {
    public: {
      Tables: {
        auctions: {
          Row: {
            id: string;
            title: string;
            description: string;
            imageUrl: string;
            status: "OPEN" | "CLOSED";
            startingPrice: number;
            created_at: string;
          };
          Insert: {
            id?: string;
            title: string;
            description?: string;
            imageUrl?: string;
            status?: "OPEN" | "CLOSED";
            startingPrice: number;
            created_at?: string;
          };
          Update: {
            id?: string;
            title?: string;
            description?: string;
            imageUrl?: string;
            status?: "OPEN" | "CLOSED";
            startingPrice?: number;
            created_at?: string;
          };
        };
      };
    };
  };
  