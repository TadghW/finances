<script>
import { db } from './firebase-config';
import { collection, query, getDocs, doc, onSnapshot} from "firebase/firestore";
import { authorised, user, income, expenditure, savings, loans, views } from './stores.js';
import ViewSelector from './ViewSelector.svelte';
import Statistics from './Statistics.svelte';
import Breakdown from './Breakdown.svelte';
import Ledgers from './Ledgers.svelte'

const userRef = doc(db, $authorised.uid, 'root');
const userIncomeRef = query(collection(doc(db, $authorised.uid, 'root'), 'income'));
const userExpenditureRef = query(collection(doc(db, $authorised.uid, 'root'), 'expenditure'));
const userSavingsRef = query(collection(doc(db, $authorised.uid, 'root'), 'savings'));
const userLoansRef = query(collection(doc(db, $authorised.uid, 'root'), 'loans'));
const userViewsRef = query(collection(doc(db, $authorised.uid, 'root'), 'views'));

//Note: Computationally expensive, creates network load, investigate different solution.
const unsubscribeFromUser = onSnapshot(userRef, (doc) => {
  const userData = doc.data()
  user.set({
    'currency': userData.currency,
    'email': userData.email,
    'name': userData.name
  })
})

const unsubscribeFromIncome = onSnapshot(userIncomeRef, (coll) => {
  let incomeStatements = [];
  coll.forEach((doc) => {
    incomeStatements.push(doc.data())
  });
  income.set(incomeStatements);
  console.log(`incomeStatements => ${incomeStatements}`)
  console.log(`$income => ${JSON.stringify($income)}`)
}, (error) => {
  console.error(error)
});

const unsubscribeFromExpenditure = onSnapshot(userExpenditureRef, async (coll) => {
  let receipts = [];
  coll.forEach((doc) => {
    receipts.push(doc.data())
  })
  expenditure.set(receipts)
}, (error) => {
  console.error(error)
})

const unsubscribeFromSavings = onSnapshot(userSavingsRef, async (coll) => {
  let savingsDockets = []
  coll.forEach((doc) => {
    savingsDockets.push(doc.data())
  })
  savings.set(savingsDockets)
}, (error) => {
  console.error(error)
})

const unsubscribeFromLoans = onSnapshot(userLoansRef, async (coll) => {
  let creditStatements = [];
  coll.forEach((doc) => {
    creditStatements.push(doc.data())
  })
  loans.set(creditStatements)
}, (error) => {
  console.error(error)
})

const unsubscribeFromViews = onSnapshot(userViewsRef, async (coll) => {
  let savedViews = [];
  coll.forEach((doc) => {
    savedViews.push(doc.data())
  })
  views.set(savedViews)
}, (error) => {
  console.warn(error)
})

</script>

<ViewSelector></ViewSelector>
<Statistics></Statistics>
<Breakdown></Breakdown>
<!--Store in different tabs?-->
<Ledgers></Ledgers>
<!--Ending here-->
  Welcome back, {$authorised.email}