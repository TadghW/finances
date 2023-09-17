<script>
    import AuthenticationManager from './AuthenticationManager.svelte'
</script>

<div id="topBar">
    <div id="logo">finances.hub</div>
    <AuthenticationManager></AuthenticationManager>
</div>

<style>
    #topBar{
       width: 100vw;
       display: flex;
       justify-content: space-between;
       align-items: center;
       border-bottom: 1px solid #000;
       margin-bottom: 20px;
   }
   
   #topBar>* {
       margin: 10px 10px
   }
   </style>