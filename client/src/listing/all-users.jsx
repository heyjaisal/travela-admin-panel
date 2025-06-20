import React, { useEffect } from "react";
import axiosInstance from "../utils/axios-instance";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  User,
} from "@heroui/react";
import { PlusIcon } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import ToggleUser from "@/utils/Restrict";
import { useNavigate } from "react-router-dom";

export const columns = [
  { name: "USERNAME", uid: "username", sortable: false },
  { name: "COUNTRY", uid: "country", sortable: false },
  { name: "EMAIL", uid: "email" },
  { name: "GENDER", uid: "gender" },
  { name: "FOLLOWERS", uid: "followers", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusColorMap = {
  active: "success",
  inactive: "danger",
  restricted:"warning"
};

const INITIAL_VISIBLE_COLUMNS = [
  "username",
  "country",
  "email",
  "gender",
  "followers",
  "status",
  "actions",
];

export default function Allusers() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [filterValue, setFilterValue] = React.useState("");
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(1);
  const navigate = useNavigate()
  const [users, setUsers] = React.useState([]);
  const [newUser , setNewUser ] = React.useState({
    password: "",
    username: "",
    email: "",
    age: "",
    country: "",
  });

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(
        "/listing/all-users",
        { withCredentials: true }
      );
   
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const user = users.map(Host => ({
    _id: users._id, 
    username: users.username,
    country: users.country, 
    status: users.status,
    age: users.age,
    phone: users.phone, 
    avatar: users.image || null,
    email: users.email,
  }));

  const handleAddUser  = async () => {
    try {
      await axiosInstance.post("/admin/add-user", newUser , { withCredentials: true });
      setNewUser ({ password: '', username: '', email: '', age: '', country: '' });
      onOpenChange(false);

      const response = await axiosInstance.get('/listing/all-users', { withCredentials: true });
      setUsers(response.data);

      toast.success('User  created successfully');
    } catch (error) {
      console.log('Error adding user', error);
      const errorMessage = error.response?.data?.message || 'Failed to create user. Please try again.';
      toast.error(errorMessage);
    }
  };

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "username":
        return (
          <User     
            avatarProps={{
              radius: "lg",
              src: user.image || undefined,
              fallback: user.username.charAt(0).toUpperCase(),
            }}
            description={user.email}
            name={cellValue}
          >
            {user.email}
          </User  >
        );
      case "country":
        return <p>{cellValue}</p>;
      case "gender":
        return <p>{cellValue}</p>;
      case "followers":
        return <p>{user.followers.length}</p>; 
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[user.status]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <PlusIcon className="text-default-300" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                <DropdownItem key="view" onClick={()=>navigate(`/all-users/user/${user._id}`)}>View</DropdownItem>
                  <DropdownItem key="suspend">Suspend</DropdownItem>
                  <DropdownItem key="restrict">
                  <ToggleUser  userId={user._id} userType="user" currentStatus={user.status} onSuccess={fetchUsers} />
                  </DropdownItem>
                  <DropdownItem key="delete">Delete</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
      default:
        return cellValue;
    }
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.username &&
      user.username.toLowerCase().includes(filterValue.toLowerCase())
  );

  const pagesCount = Math.ceil(filteredUsers.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredUsers.slice(start, end);
  }, [page, rowsPerPage, filteredUsers]);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by username..."
            value={filterValue}
            onClear={() => setFilterValue("")}
            onValueChange={(value) => {
              setFilterValue(value);
              setPage(1);
            }}
          />
          <div className="flex gap-3">
            <Button color="primary" endContent={<PlusIcon />} onPress={onOpen}>
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {filteredUsers.length} users
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [filterValue, filteredUsers.length]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400"></span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pagesCount}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={page === 1}
            size="sm"
            variant="flat"
            onPress={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <Button
            isDisabled={page === pagesCount}
            size="sm"
            variant="flat"
            onPress={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [page, pagesCount]);

  return (
    <div className="p-5">
      <ToastContainer />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add New User
              </ModalHeader>
              <ModalBody>
                <Input
                  placeholder="username"
                  value={newUser .username}
                  onChange={(e) =>
                    setNewUser ({ ...newUser , username: e.target.value })
                  }
                />
                <Input
                  placeholder="Email"
                  value={newUser .email}
                  onChange={(e) =>
                    setNewUser ({ ...newUser , email: e.target.value })
                  }
                />
                <Input
                  placeholder="Password"
                  value={newUser .password}
                  onChange={(e) =>
                    setNewUser ({ ...newUser , password: e.target.value })
                  }
                />
                <Input
                  placeholder="Age"
                  value={newUser .age}
                  onChange={(e) =>
                    setNewUser ({ ...newUser , age: e.target.value })
                  }
                />
                <Input
                  placeholder="country"
                  value={newUser .country}
                  onChange={(e) =>
                    setNewUser ({ ...newUser , country: e.target.value })
                  }
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleAddUser }>
                  Add User
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Table
        isHeaderSticky
        aria-label="User  listing table"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px]",
        }}
        selectionMode="none"
        topContent={topContent}
        topContentPlacement="outside"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No users found"} items={items}>
          {(item) => (
            <TableRow key={item.email}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}