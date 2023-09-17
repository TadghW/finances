<script>
    import { statistics } from "./stores";
</script>

<div>
    {#if $statistics}
        
        <!--Income by source: {JSON.stringify($statistics['incomeBySource'])} ({$statistics['incomeBySource']}) <br/>
        Income by type: {$statistics['incomeByType']} <br/>
        Expenditure by source: {$statistics['expenditureBySource']} <br/>
        Expenditure by type: {$statistics['expenditureByType']} <br/>
        Savings by destination: {$statistics['savingsByDestination']} <br/>
        Savings by type: {$statistics['savingsByType']}<br/>
        Loans by source: {$statistics['loansBySource']}<br/>
        Loans by type: {$statistics['loansByType']}<br/>-->

        Key Income Sources: 
        {#each $statistics['keyIncomeSources'] as source}
            Source: {source.name} | Value: {source.total}
        {/each}
        {JSON.stringify($statistics['keyIncomeSources'])}<br/>
        Key Income Types: {$statistics['keyIncomeTypes']}<br/>
        Key Expenditure Sources: {$statistics['keyExpenditureSources']}<br/>
        Key Expenditure Types: {$statistics['keyExpenditureTypes']}<br/>
        Key Saving Destinations: {$statistics['keySavingsDestinations']}<br/>
        Key Saving Types: {$statistics['keySavingsByType']}<br>
        Key Loan Sources: {$statistics['keyLoansBySource']}<br>
        Key Loan Types: {$statistics['keyLoansByType']}<br>
        Net Worth Direction: {$statistics['netWorthDirection']}<br>
    {/if}
</div>