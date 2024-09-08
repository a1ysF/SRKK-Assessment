// Toggle the expense form visibility
document.getElementById('add-expense-btn').addEventListener('click', function() {
    const expenseForm = document.getElementById('expense-form');
    const addExpenseBtn = document.getElementById('add-expense-btn');
    
    // Toggle visibility of the form
    expenseForm.classList.toggle('d-none');
    
    // Hide the "Add New Expense" button
    addExpenseBtn.classList.add('d-none');
});

// Function to update expense bars based on the selected year
function updateExpenseBars() {
    const selectedYear = document.getElementById('filter-year').value; // Get selected year
    const expenseList = document.querySelectorAll('.expense-item');
    const expenseData = {};

    // Collect expense data month-wise for the selected year
    expenseList.forEach(item => {
        const dayElement = item.querySelector('.expense-date-day span');
        const monthElement = item.querySelector('.expense-date-info span:first-child');
        const yearElement = item.querySelector('.expense-date-info span:last-child');
        const amountElement = item.querySelector('.expense-amount');
        
        // Parse the date components
        const day = dayElement ? dayElement.textContent : null;
        const month = monthElement ? monthElement.textContent : null;
        const year = yearElement ? yearElement.textContent : null;
        
        const date = new Date(`${month} ${day}, ${year}`);
        const amount = parseFloat(amountElement.textContent.replace('$', ''));

        // Only process expenses for the selected year
        if (year == selectedYear) {
            const monthIndex = date.getMonth(); // 0 = January, 11 = December

            if (!expenseData[monthIndex]) {
                expenseData[monthIndex] = 0;
            }
            expenseData[monthIndex] += amount;
        }
    });

    // Update the bars
    document.querySelectorAll('.month-bar').forEach(bar => {
        const month = bar.getAttribute('data-month');
        const monthIndex = new Date(`${month} 1, 2000`).getMonth(); // Convert month string to index
        
        const expenseForMonth = expenseData[monthIndex] || 0;
        const percentage = Math.min(100, (expenseForMonth / 1000) * 100); // Cap at 1000
        
        const fillBar = bar.querySelector('.bar-fill');
        if (fillBar) {
            fillBar.style.height = `${percentage}%`; // Fill according to percentage
        }

        // If there's no expense, we make sure the background stays as #c4b4f4 (empty bars)
        if (percentage === 0) {
            bar.style.backgroundColor = '#c4b4f4'; // Background for empty bars
        }
    });
}


// Function to filter expenses by year
function filterExpensesByYear(selectedYear) {
    const expenseList = document.querySelectorAll('.expense-item');
    const filteredExpenses = [];
    let hasExpenses = false;

    // Hide all expenses and filter by year
    expenseList.forEach(item => {
        const yearElement = item.querySelector('.expense-date-info span:last-child');
        const expenseYear = yearElement.textContent;

        if (expenseYear == selectedYear) {
            item.style.display = 'block'; // Show the expense
            filteredExpenses.push(item);
            hasExpenses = true;
        } else {
            item.style.display = 'none'; // Hide other expenses
        }
    });

    // Show or hide the "No expenses" message
    document.getElementById('no-expenses').style.display = hasExpenses ? 'none' : 'block';

    // Update the bars with the filtered expenses
    updateExpenseBars();
}


// Handle expense form submission
document.getElementById('new-expense-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Fetch form data
    const title = document.getElementById('title').value;
    const amount = document.getElementById('amount').value;
    const date = document.getElementById('date').value;
    const expenseYear = new Date(date).getFullYear(); // Get the year of the expense
    const expenseMonth = new Date(date).toLocaleDateString('en-US', { month: 'long' });
    const expenseDay = new Date(date).getDate();

    // Create a new expense entry with new HTML structure (date split into day, month, year)
    const expenseList = document.getElementById('expenses-list');
    const expenseItem = document.createElement('div');
    expenseItem.classList.add('expense-item');
    expenseItem.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div class="expense-date-container d-flex align-items-center">
          <div class="expense-date-info">
              <span>${expenseMonth}</span><br>
              <span>${expenseYear}</span>
          </div>
          <div class="expense-date-day">
              <span>${expenseDay}</span>
          </div>
        </div>
        <div class="expense-info">
          <p>${title}</p>
        </div>
        <div class="expense-amount">$${parseFloat(amount).toFixed(2)}</div>
      </div>
    `;

    // Append new expense and clear form
    expenseList.appendChild(expenseItem);
    document.getElementById('new-expense-form').reset();
    document.getElementById('expense-form').classList.add('d-none'); // Hide form after adding the expense
    
    // Show the "Add New Expense" button again
    document.getElementById('add-expense-btn').classList.remove('d-none');
    
    // Add year to dropdown if not present
    const yearDropdown = document.getElementById('filter-year');
    if (!Array.from(yearDropdown.options).some(option => option.value == expenseYear)) {
        const newYearOption = document.createElement('option');
        newYearOption.value = expenseYear;
        newYearOption.textContent = expenseYear;
        yearDropdown.appendChild(newYearOption);
    }

    // Automatically select the new year and filter expenses
    yearDropdown.value = expenseYear;
    filterExpensesByYear(expenseYear); // Filter expenses for the new year
});

// Cancel form
document.getElementById('cancel-btn').addEventListener('click', function() {
    document.getElementById('expense-form').classList.add('d-none');  // Hide the form on cancel
    document.getElementById('add-expense-btn').classList.remove('d-none');  // Show the "Add New Expense" button again
});

// Event listener to filter by year
document.getElementById('filter-year').addEventListener('change', function() {
    const selectedYear = this.value;
    filterExpensesByYear(selectedYear);
});

// Call this once to initialize the bars with pre-existing expenses
const initialYear = document.getElementById('filter-year').value;
filterExpensesByYear(initialYear);
