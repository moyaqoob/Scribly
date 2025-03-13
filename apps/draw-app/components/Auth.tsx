

export const Auth = ({ isSignIn }: { isSignIn: boolean }) => {
    return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="border p-4 flex flex-col f">
        <input type="text" placeholder="email" />
        <input type="text" placeholder="email" />
        <button>{isSignIn ? "Signin" : "SignUp"} </button>
      </div>
    </div>
  );
};

export default Auth;
