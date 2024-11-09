import { Button } from "@/components/ui/button";
import { SignUpButton, SignInButton } from "@clerk/clerk-react";

interface AuthButtonProps {
  type: "signUp" | "signIn";
  mode: "modal" | "redirect";
  redirectUrl?: string;
  className?: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  type,
  mode,
  redirectUrl,
  className,
}) => {
  const ButtonComponent = type === "signUp" ? SignUpButton : SignInButton;

  return (
    <ButtonComponent
      mode={mode}
      signUpFallbackRedirectUrl={redirectUrl}
      signInFallbackRedirectUrl={redirectUrl}
      forceRedirectUrl={redirectUrl}
    >
      <Button className={className}>
        {type === "signUp" ? "Sign Up" : "Sign In"}
      </Button>
    </ButtonComponent>
  );
};

export default AuthButton;
