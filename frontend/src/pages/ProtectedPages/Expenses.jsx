import React, { useState, useEffect } from "react";
import { object, string, number, date } from "yup";
import { toast } from "react-toastify";
import moment from "moment";
import { parseDate } from "@internationalized/date";
import { NumericFormat } from "react-number-format";

import { useDispatch, useSelector } from "react-redux";
import {
  useGetExpenseQuery,
  useAddExpenseMutation,
  useDeleteExpenseMutation,
} from "../../features/api/apiSlices/expenseApiSlice";
import { updateLoader } from "../../features/loader/loaderSlice";
import { setDashboardRefresh } from "../../features/TransactionModals/viewAndUpdateModal";

import { TransactionForm } from "../../components/Forms";
import validateForm from "../../utils/validateForm";
import TransactionTable from "../../components/Tables/TransactionTable";

const Expenses = () => {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: parseDate(moment().format("YYYY-MM-DD")),
  });
  const [errors, setErrors] = useState({});
  const [totalExpense, setTotalExpense] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const isRefetchDeleteModal = useSelector((state) => state.deleteTransactionModal.refetch);
  const isRefetchViewAndUpdateModal = useSelector((state) => state.transactionViewAndUpdateModal.refetch);

  const expenseCategories = [
    { label: "Groceries", value: "groceries" },
    { label: "Utilities", value: "utilities" },
    { label: "Transportation", value: "transportation" },
    { label: "Healthcare", value: "healthcare" },
    { label: "Entertainment", value: "entertainment" },
    { label: "Clothing", value: "clothing" },
    { label: "Other", value: "other" },
  ];

  const validationSchema = object({
    title: string().required("Title is required.").min(5).max(15),
    amount: number("Amount must be a number").required().positive(),
    description: string().required().min(5).max(80),
    date: date().required("Date is required."),
    category: string().required().oneOf(expenseCategories.map(c => c.value)),
  });

  const chipColorMap = {
    groceries: "success",
    utilities: "default",
    transportation: "success",
    healthcare: "warning",
    entertainment: "danger",
    clothing: "warning",
    other: "default",
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateForm(name, value, validationSchema, setErrors);
  };

  const handleDateChange = (newDate) => {
    setFormData({ ...formData, date: newDate });
  };

  const [addExpense, { isLoading: addExpenseLoading }] = useAddExpenseMutation();
  const [deleteExpense] = useDeleteExpenseMutation();
  const { data, isLoading: getExpenseLoading, refetch } = useGetExpenseQuery({
    page: currentPage,
    pageSize: 10,
  });

  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      await refetch();
      if (data?.expenses) {
        setTotalExpense(data.totalExpense);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.error || "Error while fetching data.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateLoader(40));
      const formattedDate = moment({
        year: formData.date.year,
        month: formData.date.month - 1,
        day: formData.date.day,
      }).format("YYYY-MM-DD");

      const updatedFormData = { ...formData, date: formattedDate };

      const res = await addExpense(updatedFormData).unwrap();
      dispatch(updateLoader(60));
      toast.success(res.message || "Expense added successfully!");
      dispatch(setDashboardRefresh(true));

      setFormData({
        title: "",
        amount: "",
        description: "",
        category: "",
        date: parseDate(moment().format("YYYY-MM-DD")),
      });
      setErrors({});
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.error || "Unexpected Internal Server Error!");
    } finally {
      await refetch();
      dispatch(updateLoader(100));
    }
  };

  const handleDelete = async (_id) => {
    try {
      await deleteExpense(_id).unwrap();
      toast.success("Expense deleted!");
      await refetch();
    } catch (err) {
      toast.error("Failed to delete expense.");
    }
  };

  useEffect(() => {
    fetchData();
    if (isRefetchDeleteModal || isRefetchViewAndUpdateModal) fetchData();
  }, [data, isRefetchDeleteModal, isRefetchViewAndUpdateModal]);

  const hasErrors = Object.values(errors).some((error) => !!error);

  return (
    <>
      <h3 className="text-3xl lg:text-5xl mt-4 text-center">
        Total Expense -{" "}
        <span className="text-red-400">
          ₹
          <NumericFormat
            className="ml-1 text-2xl lg:text-4xl"
            value={totalExpense}
            displayType={"text"}
            thousandSeparator={true}
          />
        </span>
      </h3>
      <section className="w-full h-full flex flex-col lg:flex-row px-6 md:px-8 lg:px-12 pt-6 space-y-8 lg:space-y-0 lg:space-x-8">
        <TransactionForm
          button="Add Expense"
          categories={expenseCategories}
          btnColor="danger"
          formData={formData}
          errors={errors}
          hasErrors={hasErrors}
          isLoading={addExpenseLoading}
          handleOnChange={handleOnChange}
          handleDateChange={handleDateChange}
          handleSubmit={handleSubmit}
        />
        <TransactionTable
          data={data?.expenses}
          name="expense"
          rowsPerPage={10}
          chipColorMap={chipColorMap}
          isLoading={getExpenseLoading}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onDelete={handleDelete}
        />
      </section>
    </>
  );
};

export default Expenses;
