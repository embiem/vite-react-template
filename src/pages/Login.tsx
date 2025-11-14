import { LogInForm } from "../components/LogIn";
import { SignUpForm } from "../components/SignUp";

const tabCn = "tab-content bg-base-100 border-base-300 p-6";

function LoginPage() {
  return (
    <div className="tabs tabs-lift">
      <input
        type="radio"
        name="tabs_login"
        className="tab"
        aria-label="Login"
      />
      <div className={tabCn}>
        <LogInForm />
      </div>

      <input
        type="radio"
        name="tabs_login"
        className="tab"
        aria-label="Signup"
        defaultChecked
      />
      <div className={tabCn}>
        <SignUpForm />
      </div>
    </div>
  );
}

export default LoginPage;
