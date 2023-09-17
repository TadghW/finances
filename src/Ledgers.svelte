<script> 
import { authorised, income, expenditure, savings, loans, views } from './stores'
import { db } from './firebase-config'
import { doc, query, collection, addDoc } from 'firebase/firestore'

let incomeType
let incomeSource
let incomeSum
let incomeDate
let expenditureType
let expenditureSource
let expenditureSum
let expenditureDate
let savingType
let savingDestination
let savingSum
let savingDate
let loanType
let loanSource
let loanSum
let loanDate

async function submitIncome(){
  const userIncomeRef = query(collection(doc(db, $authorised.uid, 'root'), 'income'));
  try {
    docRef = await addDoc(userIncomeRef, {
      type: incomeType,
      source: incomeSource,
      sum: incomeSum,
      date: incomeDate
    })
    console.log(`Document written to ${$authorised.uid}'s income collection with id ${docRef.id}'`)
  } catch (error){
    console.log(error)
  }
}

async function submitExpense(){
  const userExpenditureRef = query(collection(doc(db, $authorised.uid, 'root'), 'expenditure'));
  try {
    docRef = await addDoc(userExpenditureRef, {
      type: expenditureType,
      source: expenditureSource,
      sum: expenditureSum,
      date: expenditureDate
    })
    console.log(`Document written to ${$authorised.uid}'s income collection with id ${docRef.id}'`)
  } catch (error){
    console.log(error)
  }}

async function submitSaving(){
  const userSavingsRef = query(collection(doc(db, $authorised.uid, 'root'), 'savings'));
  try {
    docRef = await addDoc(userSavingsRef, {
      type: savingType,
      source: savingDestination,
      sum: savingSum,
      date: savingDate
    })
    console.log(`Document written to ${$authorised.uid}'s income collection with id ${docRef.id}'`)
  } catch (error){
    console.log(error)
  }
}

async function submitLoan(){
  const userLoansRef = query(collection(doc(db, $authorised.uid, 'root'), 'loans'));
  try {
    docRef = await addDoc(userLoansRef, {
      type: loanType,
      source: loanSource,
      sum: loanSum,
      date: loanDate
    })
    console.log(`Document written to ${$authorised.uid}'s income collection with id ${docRef.id}'`)
  } catch (error){
    console.log(error)
  }
}
</script>

<div id="ledgers"> 
  <div>
    <div id="income-ledger" class="ledger">
      <div class="ledger-title">Income</div>
      <div class="ledger-display">
        {#if $income}
          {#each $income as incomeStatement}
            <div class="ledger-entry">
              <div class="ledger-entry-component">
                {incomeStatement.type}
              </div>
              <div class="ledger-entry-component">
                {incomeStatement.source}
              </div>  
              <div class="ledger-entry-component">
                {incomeStatement.sum}
              </div>      
              <div class="ledger-entry-component">
                {incomeStatement.date}
              </div>  
            </div>
          {/each}
        {/if}
      </div>
      <div class="ledger-input">
        <input type="text" placeholder="type" bind:value={incomeType}>
        <input type="text" placeholder="source" bind:value={incomeSource}>
        <input type="text" placeholder="sum" bind:value={incomeSum}>
        <input type="date" bind:value={incomeDate}>
        <button on:click={submitIncome}>Submit</button>
      </div>
    </div>
    <div id="expenditure-ledger" class="ledger">
      <div class="ledger-title">Expenditure</div>
      <div class="ledger-display">
        {#if $expenditure}
          {#each $expenditure as receipt}
            <div class="ledger-entry">
              <div class="ledger-entry-component">
                {receipt.type}
              </div>
              <div class="ledger-entry-component">
                {receipt.source}
              </div>  
              <div class="ledger-entry-component">
                {receipt.sum}
              </div>      
              <div class="ledger-entry-component">
                {receipt.date}
              </div>  
            </div>
          {/each}
        {/if}
      </div>
      <div class="ledger-input">
        <input type="text" placeholder="type" bind:value={expenditureType}>
        <input type="text" placeholder="source" bind:value={expenditureSource}>
        <input type="text" placeholder="sum" bind:value={expenditureSum}>
        <input type="date" bind:value={expenditureDate}>
        <button on:click={submitExpense}>Submit</button>
      </div>
    </div>
  </div>
  <div>
    <div id="savings-ledger" class="ledger">
      <div class="ledger-title">Savings</div>
      <div class="ledger-display">
        {#if $savings}
          {#each $savings as saving}
            <div class="ledger-entry">
              <div class="ledger-entry-component">
                {saving.type}
              </div>
              <div class="ledger-entry-component">
                {saving.source}
              </div>  
              <div class="ledger-entry-component">
                {saving.sum}
              </div>      
              <div class="ledger-entry-component">
                {saving.date}
              </div>  
            </div>
          {/each}
        {/if}
      </div>
      <div class="ledger-input">
        <input type="text" placeholder="type" bind:value={savingType}>
        <input type="text" placeholder="destination" bind:value={savingDestination}>
        <input type="text" placeholder="sum" bind:value={savingSum}>
        <input type="date" bind:value={savingDate}>
        <button on:click={submitSaving}>Submit</button>
      </div>
    </div>
    <div id="loans-ledger" class="ledger">
      <div class="ledger-title">Loans</div>
      <div class="ledger-display">
        {#if $loans}
          {#each $loans as loan}
          <div class="ledger-entry">
            <div class="ledger-entry-component">
              {loan.type}
            </div>
            <div class="ledger-entry-component">
              {loan.source}
            </div>  
            <div class="ledger-entry-component">
              {loan.sum}
            </div>      
            <div class="ledger-entry-component">
              {loan.date}
            </div>  
          </div>
          {/each}
        {/if}
      </div>
      <div class="ledger-input">
        <input type="text" placeholder="type" bind:value={loanType}>
        <input type="text" placeholder="source" bind:value={loanSource}>
        <input type="text" placeholder="sum" bind:value={loanSum}>
        <input type="date" bind:value={loanDate}>
        <button on:click={submitLoan}>Submit</button>
      </div>
    </div>
  </div>
</div>

<style>
  #ledgers {
    display: flex;
    flex-flow: column nowrap;
    width: 100vw;
    padding: 30px;
    border: 1px solid #000;
  }
  #ledgers>div {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    border: 1px solid #000;
    padding: 10px;
  }
  .ledger {
    display: flex;
    flex-flow: column nowrap;
    width: 45vw;
    border: 1px solid #000;
    padding: 10px;
  }
  .ledger>*{
    padding: 10px;
  }
  .ledger-entry{
    display: flex;
    flex-flow: row;
    justify-content: space-evenly;
    align-items: center;
    padding: 10px;
  }
</style>
