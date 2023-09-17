import { db, auth } from './firebase-config'
import { collection, getDocs, query, limit} from 'firebase/firestore'
import { writable, derived} from 'svelte/store'

//Stores auth flow info
export const authorised = writable(null)

auth.onAuthStateChanged(function(user){
  console.log(`authorised user set`)
  authorised.set(user)
})

//Detects if the user has an account
export const newUser = derived(
  authorised,
  async ($authorised, set) => {
    if ($authorised === null) {
      console.log(`newUserChecker sees that there's nothing stored in the authorised variable, defaulting to loading screen`)
      set(null)
    } else if ($authorised === false) {
      console.log(`newUserChecker sees no authorised user...`);
      set(true);
    } else {
      console.log(`newUserChecker sees an authorised user...`);
      console.log(`newUserChecker is checking to see if ${$authorised.email} has an account with us`);
      try {
        const userAccount = collection(db, $authorised.uid)
        const q = query(userAccount, limit(1))
        const snapshot = await getDocs(q)
        if (snapshot.empty) {
          console.log(`User ${$authorised.uid} does not have an account`);
          console.log(`newUser = true`);
          set(true); 
        } else {
          console.log(`User ${$authorised.uid} has an account`);
          console.log(`newUser = false`);
          set(false);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }
  , null
);

export const user = writable(null)
export const income = writable(null)
export const expenditure = writable(null)
export const savings = writable(null)
export const loans = writable(null)
export const views = writable(null)
export const activeView = writable({
  'fromDate': 0,
  'toDate': Infinity,
  'includes': ['income', 'expenditure', 'savings', 'loans']
})

//Array of income statement objects that fit within currentView
export const selectedIncome = derived(
  [income, activeView],
  ([$income, $activeView], set) => {
    console.log(`calculating selectedIncome...`)
    if($income === null){
      set(null)
    } else if($activeView['includes'].includes('income')){
      let visible = [];
      $income.forEach(statement => {
        if(dateStringToTimestamp(statement['date']) > $activeView['fromDate'] && dateStringToTimestamp(statement['date']) < $activeView['toDate']){
          visible.push(statement)
        }
      });
      set(visible)
    }
  }, null
);

//Array of receipts objects that fit within currentView
export const selectedExpenditure = derived(
  [expenditure, activeView],
  ([$expenditure, $activeView], set) => {
    if($expenditure === null){
      set(null)
    } else if($activeView['includes'].includes('expenditure')){
      let visible = [];
      $expenditure.forEach(receipt => {
        if(dateStringToTimestamp(receipt['date']) > $activeView['fromDate'] && dateStringToTimestamp(receipt['date']) < $activeView['toDate']){
          visible.push(receipt)
        }
      });
      set(visible)
    }
  }, null
);

//Array of savings that fit within currentView
export const selectedSavings = derived(
  [savings, activeView],
  ([$savings, $activeView], set) => {
    if($savings === null){
      set(null)
    }else if($activeView['includes'].includes('savings')){
      let visible = [];
      $savings.forEach(saving => {
        if(dateStringToTimestamp(saving['date']) > $activeView['fromDate'] && dateStringToTimestamp(saving['date']) < $activeView['toDate']){
          visible.push(saving)
        }
      });
      set(visible)
    }
  }, null
);

//Array of loan objects that fit within currentView
export const selectedLoans = derived(
  [loans, activeView],
  ([$loans, $activeView], set) => {
    if($loans === null){
      set(null)
    }else if($activeView['includes'].includes('loans')){
      let visible = [];
      $loans.forEach(credit => {
        if(dateStringToTimestamp(credit['date']) > $activeView['fromDate'] && dateStringToTimestamp(credit['date']) < $activeView['toDate']){
          visible.push(credit)
        }
      });
      set(visible)
    } else {
      set(null)
    }
  }
);

export const statistics = derived(
  [selectedIncome, selectedExpenditure, selectedSavings, selectedLoans],
  ([$selectedIncome, $selectedExpenditure, $selectedSavings, $selectedLoans], set) => {
    //object with named arrays of objects within it
    const incomeBySource = reduceAndSum($selectedIncome, 'source')
    const incomeByType = reduceAndSum($selectedIncome, 'type')
    const expenditureBySource = reduceAndSum($selectedExpenditure, 'source')
    const expenditureByType = reduceAndSum($selectedExpenditure, 'type')
    const savingsByDestination = reduceAndSum($selectedSavings, 'destination')
    const savingsByType = reduceAndSum($selectedSavings, 'type')
    const loansBySource = reduceAndSum($selectedLoans, 'source')
    const loansByType = reduceAndSum($selectedLoans, 'type')
    const keyIncomeSources = topFive(incomeBySource)
    const keyIncomeTypes = topFive(incomeByType)
    const keyExpenditureSources = topFive(expenditureBySource)
    const keyExpenditureTypes = topFive(expenditureByType)
    const keySavingsDestinations = topFive(savingsByDestination)
    const keySavingsByType = topFive(savingsByType)
    const keyLoansBySource = topFive(loansBySource)
    const keyLoansByType = topFive(loansByType)
    const totalIncome = sumAll($selectedIncome)
    const totalExpenditure = sumAll($selectedExpenditure)
    const totalSavings = sumAll($selectedSavings)
    const totalLoans = sumAll($selectedLoans)
    const netWorthDirection = ((totalIncome + totalSavings) - (totalExpenditure + totalLoans))
    set({
      "incomeBySource": incomeBySource,
      "incomeByType": incomeByType,
      "expenditureBySource": expenditureBySource,
      "expenditureByType": expenditureByType,
      "savingsByDestination": savingsByDestination,
      "savingsByType": savingsByType,
      "loansBySource": loansBySource,
      "loansBySource": loansBySource,
      "keyIncomeSources": keyIncomeSources,
      "keyIncomeTypes": keyIncomeTypes,
      "keyExpenditureSources": keyExpenditureSources,
      "keyExpenditureTypes": keyExpenditureTypes,
      "keySavingsDestinations": keySavingsDestinations,
      "keySavingsByType": keySavingsByType,
      "keyLoansBySource": keyLoansBySource,
      "keyLoansByType": keyLoansByType,
      "netWorthDirection": netWorthDirection
    })
  }, null
)

function reduceAndSum(data, attribute){
  if(data === null){
    return null
  } else {
    return sumGroups(reduceToGroup(data, attribute))
  }
}

function reduceToGroup(data, attribute){
  if(data === null){
    return null
  } else {
    return data.reduce((acc, item) => {
      acc[item[attribute]] = (acc[item[attribute]] || []).concat(item);
      return acc;
    }, {});
  }
}

function sumGroups(groupedData){
  if(groupedData === null){
    return null
  } else {
    return Object.keys(groupedData).map(key => {
      return {
        name: key,
        total: groupedData[key].reduce((sum, item) => sum + item.value, 0)
      };
    })
  }
}

function topFive(groupedTotals){
  if(groupedTotals === null){
    return null
  } else {
    return groupedTotals.sort((a, b) => b.total - a.total).slice(0, 5);
  }
}

function sumAll(data){
  if(data === null){
    return null
  } else {
    let total = 0;
    for(const entry of data) {
      total += entry.sum
    }
    return total
  }
}

function dateStringToTimestamp(dateString) {
  const date = new Date(dateString);
  return date.getTime();
}