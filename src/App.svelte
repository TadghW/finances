<script>
import WelcomeForm from './WelcomeForm.svelte'
import { authorised, newUser } from './stores'
import UserDashboard from './UserDashboard.svelte';
import LandingPage from './LandingPage.svelte';
import NavBar from './NavBar.svelte';

</script>
<NavBar></NavBar>
{#if $newUser === null}
  <div>Loading...</div>
{:else}
  {#if $authorised && $newUser}
    <WelcomeForm></WelcomeForm>
  {/if}
  {#if $authorised && !$newUser}
    <UserDashboard></UserDashboard>
  {/if}
  {#if !($authorised)}
    <LandingPage></LandingPage>
  {/if}
{/if}
