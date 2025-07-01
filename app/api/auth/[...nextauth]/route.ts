import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { OAuthConfig } from "next-auth/providers/oauth";

const SquareProvider: SquareProviderType = {
  id: "square",
  name: "Square",
  type: "oauth",
  version: "2.0",
  authorization: {
    url: "https://connect.squareupsandbox.com/oauth2/authorize",
    params: {
      scope: "MERCHANT_PROFILE_READ PAYMENTS_READ",
    },
  },
  token: {
    async request(context) {
      const { code } = context.params;
      console.log("Inside Request Token Function");
      console.log(code);
      const tokenRes = await fetch(
        "https://connect.squareupsandbox.com/oauth2/token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client_id: "sandbox-sq0idb-NVv4Hvg3gVjjRop-DMv6xg",
            grant_type: "authorization_code",
            code,
            redirect_uri: "http://localhost:3000/api/auth/callback/square",
            client_secret: process.env.SQUARE_CLIENT_SECRET,
          }),
        }
      );

      const tokenData = await tokenRes.json();
      console.log("Token Response", tokenData);

      return {
        tokens: {
          provider: tokenData.provider,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: tokenData.expires_at,
        },
      };
    },
  },
  userinfo: {
    url: "https://connect.squareupsandbox.com/v2/merchants/me",
  },
  clientId: process.env.SQUARE_CLIENT_ID,
  clientSecret: process.env.SQUARE_CLIENT_SECRET,
  checks: ["state"],

  profile(profile) {
    return {
      id: profile.merchant?.id,
      name: profile.merchant?.business_name,
      email: null,
    };
  },
} satisfies OAuthConfig<any>;

export const authOptions: NextAuthOptions = {
  providers: [SquareProvider],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      console.log("Account => ", account);
      console.log("Token => ", token);
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

type SquareProviderType = {
  id: string;
  name: string;
  type: "oauth";
  version: string;
  authorization: {
    url: string;
    params: {
      scope: string;
    };
  };
  token: {
    request: (context: any) => Promise<{
      tokens: {
        provider: string;
        access_token: string;
        refresh_token: string;
        expires_at: number;
      };
    }>;
  };
  userinfo: {
    url: string;
  };
  clientId: string;
  clientSecret: string;
  checks: string[];
  profile: (profile: any) => {
    id: string;
    name: string;
    email: string | null;
    image: string | null;
  };
};
