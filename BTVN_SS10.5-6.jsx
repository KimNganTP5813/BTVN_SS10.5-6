import React, { useEffect, useState } from "react";
import TodoFilter from "./TodoFilter";
import AddTodo from "./AddTodo";
import TodoList from "./TodoList";
import FooterActions from "./FooterAction";
import axios from "axios";
import { override } from "./Loading";
import MoonLoader from "react-spinners/MoonLoader";

export default function TodoForm() {
  const [loading, setLoading] = useState(true);
  const [listData, setListData] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [id, setId] = useState(null);

  const handleGetListData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3000/listTodo`);
      setListData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetListData();
  }, []);

//Hàm mở modal xác nhận xóa
  const handleConfirmDelete = (id) => {
    //Mở modal xác nhận xóa
    setShowConfirm(true);
    //Cập nhật lại Id cần xóa
    setId(id);
  };

  //Hàm đóng modal xác nhận xóa
  const handleCloseConfirmDelete = () => {
    //Đóng modal xác nhận xóa
    setShowConfirm(false);
    //Cập nhật lại Id
    setId(null);
  };

  //Hàm xóa thông tin
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/TodoList${id}`
      );
      //Kiểm tra dữ liệu response từ server để xử lý logic
      if (response.status === 200) {
        //Tắt modal
        handleCloseConfirmDelete();
        //Render lại giao diện
        handleGetListData();
        //Thông báo thành công
        message.success("Xóa thành công");
      }
    } catch (error) {
      message.error("Xóa thông tin thất bại");
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center w-full">
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center z-50 rounded-lg opacity-65 bg-gray-700">
          <MoonLoader
            loading={loading}
            size={50}
            cssOverride={override}
            color="#ffffff"
          />
        </div>
      )}
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow">
        <h1 className="text-center text-2xl font-semibold mb-4">
          Quản lý công việc
        </h1>
        <AddTodo />
        <TodoFilter />
        <TodoList todos={listData} />
        <FooterActions />
      </div>
    </div>
  );
}
