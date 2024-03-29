import { useRouter } from "next/router";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  CHECK_RESET_TOKEN,
} from "@/requetes/queries/auth.queries";
import {
  ChangePasswordMutation,
  ChangePasswordMutationVariables,
  CheckResetTokenQuery,
  CheckResetTokenQueryVariables,
} from "@/types/graphql";
import { useEffect } from "react";
import Link from "next/link";
import { CHANGE_PASSWORD } from "@/requetes/mutations/auth.mutations";

function Reset() {
  const router = useRouter();
  const [checkToken, { data, loading }] = useLazyQuery<
    CheckResetTokenQuery,
    CheckResetTokenQueryVariables
  >(CHECK_RESET_TOKEN);

  const [changePassword, { data: dataChange }] = useMutation<
    ChangePasswordMutation,
    ChangePasswordMutationVariables
  >(CHANGE_PASSWORD);

  useEffect(() => {
    if (router.isReady) {
      const token = router.query.token;
      if (token) {
        checkToken({
          variables: {
            token: token as string,
          },
        });
      }
    }
  }, [router.isReady]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as { password: string };

    //faire ma requête
    console.log("%c⧭", "color: #733d00", data);
    const token = router.query.token;
    if (token) {
      changePassword({
        variables: {
          data: { password: data.password, token: token as string },
        },
        onCompleted(data) {
          console.log("data", data);
        },
      });
    }
  };

  if (loading) {
    <div>Vérification en cours</div>;
  }
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      <div>
        {data?.checkResetToken.success ? (
          <form onSubmit={handleSubmit}>
            <div>
              <h1>Réinitialisation de mot de passe</h1>
              {!dataChange?.changePassword.success && (
                <>
                  <input
                    name="password"
                    placeholder="Indiquez votre nouveau mot de passe"
                  />
                  <input type="submit" />
                </>
              )}
            </div>
            {dataChange?.changePassword.success && (
              <div>
                <Link href="/auth/login">
                  {dataChange?.changePassword.message}
                </Link>
              </div>
            )}
          </form>
        ) : (
          <div>
            Vous n'avez pas un jeton valide, merci de relancer la
            réinitialisation du mot de passe
          </div>
        )}
      </div>
    </main>
  );
}

export default Reset;
