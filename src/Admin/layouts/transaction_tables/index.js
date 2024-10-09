// <<<<<<< HEAD
import React, { useState, useEffect } from "react";
import Transaction from "../components/transaction";
import { Api } from "Api/Api";

const TransactionList = () => {
  const [transactionList, setTransactionList] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const handlePageChangedata = (newPage) => {
    fetchData(newPage, search);
  };
  const handleSreachChangedata = (search) => {
    console.log(page);
    fetchData(page, search);
  };

  useEffect(() => {
    fetchData(page, search);
  }, []);

  const fetchData = async (page, search) => {
    try {
      const response = await Api.getAlltransactionList(page, search);
      console.log(response.Transactions.data);
      if (response) {
        setTransactionList(response.Transactions);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <Transaction
      transactionList={transactionList}
      handlePageChangedata={handlePageChangedata}
      handleSreachChangedata={handleSreachChangedata}
    />
  );
};

export default TransactionList;
