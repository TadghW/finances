<script>
  import { auth } from './firebase-config'
  import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
  import { authorised } from './stores';

  const googleProvider = new GoogleAuthProvider();
  
  async function login () {
    await signInWithPopup(auth, googleProvider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const token = credential.accessToken;
      const user = result.user;
      console.log(`Signed in! ${user} => ${token} => ${credential}`)
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const credential = GoogleAuthProvider.credentialFromError(error)
      console.log(`${error} => ${errorCode} => ${errorMessage}`)
      console.log(error)
    })
  }

</script>

{#if $authorised}
  <button id="signOut" on:click={ () => auth.signOut() }>Sign Out</button>
{:else}
  <button id="signIn" on:click={login}>Sign In</button>
{/if}

<style>
  #signOut, #signIn {
    margin-right: 20px;
    padding: 10px;
}
</style>