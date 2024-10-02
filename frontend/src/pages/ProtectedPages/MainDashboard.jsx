import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { toast } from "react-toastify";
import { NumericFormat } from "react-number-format";

import Chart from "../../components/Chart";
import { useGetAllIncomesQuery } from "../../features/api/apiSlices/incomeApiSlice";
import { useGetAllExpensesQuery } from "../../features/api/apiSlices/expenseApiSlice";
import { setDashboardRefresh } from "../../features/TransactionModals/viewAndUpdateModal";

import balanceIcon from "../../assets/balance.png";
import incomeIcon from "../../assets/income.png";
import expenseIcon from "../../assets/expense.png";

const DashboardPage = () => {
  const user = useSelector((state) => state.auth.user.username);
  const refreshDashboard = useSelector((state) => state.transactionViewAndUpdateModal.dashboardRefresh);
  const dispatch = useDispatch();

  const [totalBalance, setTotalBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [recentHistory, setRecentHistory] = useState([]);

  const { data: incomeData, refetch: refetchIncomes } = useGetAllIncomesQuery();
  const { data: expenseData, refetch: refetchExpenses } = useGetAllExpensesQuery();

  const fetchData = async () => {
    try {
      await refetchIncomes();
      await refetchExpenses();
      if (incomeData) setTotalIncome(incomeData?.totalIncome);
      if (expenseData) setTotalExpense(expenseData?.totalExpense);

      const balance = (incomeData?.totalIncome || 0) - (expenseData?.totalExpense || 0);
      setTotalBalance(balance);

      const history = [
        ...(incomeData?.incomes || []).map((t) => ({ ...t, type: "income" })),
        ...(expenseData?.expenses || []).map((t) => ({ ...t, type: "expense" })),
      ];

      history.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentHistory(history.slice(0, 3));
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.error || "Unexpected Internal Server Error!");
    }
  };

  useEffect(() => {
    fetchData();
    if (refreshDashboard) {
      dispatch(setDashboardRefresh(false));
    }
  }, [incomeData, expenseData, refreshDashboard]);

  const savings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

  let suggestion = "";
  if (savingsRate >= 50) suggestion = "🎉 Congrats! You're among the top 5% savers. Keep it up!";
  else if (savingsRate >= 30) suggestion = "👍 Great job! You're saving well above average.";
  else if (savingsRate >= 15) suggestion = "🙂 You're doing okay, but there's room to grow your savings.";
  else if (savingsRate >= 5) suggestion = "⚠️ Try reducing expenses — your savings are on the lower side.";
  else if (savingsRate >= 0) suggestion = "🚨 You're saving very little. Consider re-evaluating your spend habits.";
  else suggestion = "❌ You're spending more than you earn! Time to take action.";

  return (
    <section className="w-full h-full md:h-[90vh] px-3 md:px-6">
      <h2 className="text-2xl md:text-3xl lg:text-4xl mt-3 text-center sm:text-left">
        Hello, {user} 😊
      </h2>
      <h3 className="text-sm md:text-base lg:text-lg text-center sm:text-left">
        See what's happenning with your money, Lets Manage your incomes/expenses.{" "}
        <span className="font-bold text-primary">Spend Smartly!</span>
      </h3>

      {/* Summary Cards */}
      <div className="w-full mt-8 flex flex-col sm:flex-row gap-y-4 justify-between items-center">
        <div className="px-6 py-4 border-2 w-full sm:w-[30%] border-secondary rounded-lg inline-flex justify-between items-center">
          <div>
            <h4 className="text-base md:text-lg">Total Balance</h4>
            <h4 className="text-2xl md:text-3xl mt-1">
              ₹
              <NumericFormat className="ml-1 text-xl md:text-2xl" value={totalBalance} displayType="text" thousandSeparator />
            </h4>
          </div>
          <img src={balanceIcon} alt="Balance" className="w-10 h-10" />
        </div>
        <div className="px-6 py-4 border-2 w-full sm:w-[30%] border-secondary rounded-lg inline-flex justify-between items-center">
          <div>
            <h4 className="text-base md:text-lg">Total Incomes</h4>
            <h4 className="text-2xl md:text-3xl text-emerald-400 mt-1">
              ₹
              <NumericFormat className="ml-1 text-xl md:text-2xl" value={totalIncome} displayType="text" thousandSeparator />
            </h4>
          </div>
          <img src={incomeIcon} alt="Income" className="w-10 h-10" />
        </div>
        <div className="px-6 py-4 border-2 w-full sm:w-[30%] border-secondary rounded-lg inline-flex justify-between items-center">
          <div>
            <h4 className="text-base md:text-lg">Total Expenses</h4>
            <h4 className="text-2xl md:text-3xl text-red-400 mt-1">
              ₹
              <NumericFormat className="ml-1 text-xl md:text-2xl" value={totalExpense} displayType="text" thousandSeparator />
            </h4>
          </div>
          <img src={expenseIcon} alt="Expense" className="w-10 h-10" />
        </div>
      </div>

      <div className="w-full mt-4 text-center">
        <p className="text-base md:text-lg font-medium text-primary">{suggestion}</p>
      </div>

      <div className="w-full my-12 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-[50%]">
          <h5 className="text-2xl text-center md:text-left mb-4">Recent Transactions</h5>
          <ul className="space-y-4">
            {recentHistory.length === 0 ? (
              <li className="text-gray-500">No recent transactions to display.</li>
            ) : (
              recentHistory.map((transaction) => (
                <li key={transaction.id} className="border-2 border-secondary rounded-lg px-4 py-3 flex justify-between items-center">
                  <div className="flex items-center gap-4 w-full">
                    <img
                      src={transaction.type === "income" ? incomeIcon : expenseIcon}
                      alt={transaction.type}
                      className="w-8 h-8"
                    />
                    <div className="flex flex-col w-full justify-center leading-tight">
                      <p className="capitalize font-semibold truncate">{transaction.title}</p>
                      <p className="text-sm text-gray-500 capitalize truncate">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="min-w-[6rem] text-right">
                    <p className={`text-xl font-semibold ${transaction.type === "income" ? "text-emerald-400" : "text-red-400"}`}>
                      ₹{transaction.amount}
                    </p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="w-full md:w-[50%]">
          <h5 className="text-2xl text-center md:text-left mb-4">Overview</h5>
          <Chart income={totalIncome} expense={totalExpense} />
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
