<script>
  import { get } from 'svelte/store';
  import { collection, doc, setDoc } from 'firebase/firestore';
  import { db, auth } from './firebase-config';
  import { authorised } from './stores'; 
    
  const users = collection(db, 'users')
  let firstName = ''
  let preferredCurrency = ''
    
  async function registerUser(){
    if(firstName && preferredCurrency){
      try {
        await setDoc(doc(db, $authorised.uid, 'root'), {
          'name': firstName,
          'email': get(authorised).email,
          'preferred_currency': preferredCurrency
        })
        console.log(`User added successfully, resetting authorised`)
        authorised.set(auth.currentUser) //This updates App.svelte's conditional rendering through the 'newUser' derived store
      } catch (error) {
         console.log(error)
      }
    } else {
      alert('Please fill out the fields :(')
    }
  }

</script>

<div id="form">
    <h2> Welcome to finances.hub </h2>
    <label for="name">What should we call you?</label>
    <input type="text" name="name" bind:value={firstName}>
    <label for="currency">What currency do you use?</label>
    <select name="currency" bind:value={preferredCurrency}>
        <option value = "eur" selected>Euro (€)</option>
        <option value = "str">Sterling (£)</option>
        <option value = "usd">US Dollar ($)</option>
        <option value = "rmb">Yuan (¥)</option>
    </select>
    <button on:click={registerUser}>Submit</button>
</div>

<style>

    input, select, button {
        border-radius: 5px;
        padding: 3px;
        margin: 30px;
    }
    #form {
        width: 100vw;
        display: flex;
        justify-content: center;
        flex-flow: column;
        align-items: center;
    }
    h2 {
        margin-bottom: 40px;
    }

</style>