import React, { useEffect } from "react";
import axios from "axios";
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
  User,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { PlusIcon } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import ToggleUser  from "@/utils/Restrict"; // Ensure this path is correct

export const columns = [
  { name: "NAME", uid: "name", sortable: false },
  { name: "AGE", uid: "age", sortable: false },
  { name: "POSITION", uid: "position", sortable: false },
  { name: "EMAIL", uid: "email" },
  { name: "MOBILE", uid: "mobile" }, 
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusColorMap = {
  active: "success",
  inactive: "danger",
  restricted: "warning",
};

const INITIAL_VISIBLE_COLUMNS = ["name", "position", "mobile", "status", "actions"];

export default function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [filterValue, setFilterValue] = React.useState("");
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(1);
  const [admins, setAdmins] = React.useState([]);
  const [newUser  , setNewUser  ] = React.useState({
    password: "",
    name: "",
    email: "",
    role: "",
    position: "",
    age: "",
    mobile: "", 
    allowedPages: [],
  });

  const pages = [
    "home",
    "notifications",
    "profile",
    "messages",
    "payments",
    "all-users",
    "requests",
    "approval",
    "create",
  ];

  // Define the fetchAdmins function
  const fetchAdmins = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/all-admins', { withCredentials: true });
      setAdmins(response.data);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  useEffect(() => {
    fetchAdmins(); // Call fetchAdmins on component mount
  }, []);

  const users = admins.map(admin => ({
    _id: admin._id, // Include the ID here
    name: admin.name,
    position: admin.position, 
    status: admin.status,
    age: admin.age,
    mobile: admin.mobile, 
    avatar: admin.image || null,
    email: admin.email,
  }));

  const handleAddUser   = async () => {
    try {
      await axios.post('http://localhost:5000/api/admin/auth/add-admin', newUser  , { withCredentials: true });
      setNewUser  ({ password: "", name: "", email: "", role: "", position: "", age: "", mobile: "", allowedPages: [] });
      onOpenChange(false);
      
      fetchAdmins(); // Refresh the list of admins
      
      // Show success toast
      toast.success('User  created successfully!');
    } catch (error) {
      console.error('Error adding user:', error);
      // Show error toast
      toast.error('Failed to create user. Please try again.');
    }
  };

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User     
            avatarProps={{
              radius: "lg",
              src: user.avatar || undefined,
              fallback: user.name.charAt(0).toUpperCase(),
            }}
            description={user.email}
            name={cellValue}
          >
            {user.email}
          </User  >
        );
      case "position":
        return <p className="text-small text-gray-500">{cellValue}</p>;
      case "status":
        return (
          <Chip className="capitalize" color={statusColorMap[user.status]} size="sm" variant="flat">
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
                <DropdownItem key="view">View</DropdownItem>
                <DropdownItem key="edit">Edit</DropdownItem>
                <DropdownItem key="toggle">
                  <ToggleUser  userId={user._id} userType="admin" currentStatus={user.status} onSuccess={fetchAdmins} />
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

  // Filter users based on the search input
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(filterValue.toLowerCase())
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
            placeholder="Search by name..."
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
          <span className="text-default-400 text-small">Total {filteredUsers.length} users</span>
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
        <span className="w-[30%] text-small text-default-400">
        </span>
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
          <Button isDisabled={page === 1} size="sm" variant="flat" onPress={() => setPage(page - 1)}>
            Previous
          </Button>
          <Button isDisabled={page === pagesCount} size="sm" variant="flat" onPress={() => setPage(page + 1)}>
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
              <ModalHeader className="flex flex-col gap-1">Add New User</ModalHeader>
              <ModalBody>
                <Input
                  placeholder="Name"
                  value={newUser .name}
                  onChange={(e) => setNewUser ({ ...newUser , name: e.target.value })}
                />
                <Input
                  placeholder="Email"
                  value={newUser .email}
                  onChange={(e) => setNewUser ({ ...newUser , email: e.target.value })}
                />
                <Input
                  placeholder="Password"
                  value={newUser .password}
                  onChange={(e) => setNewUser ({ ...newUser , password: e.target.value })}
                />
                <Input
                  placeholder="Role"
                  value={newUser .role}
                  onChange={(e) => setNewUser ({ ...newUser , role: e.target.value })}
                />
                <Input
                  placeholder="Position"
                  value={newUser .position}
                  onChange={(e) => setNewUser ({ ...newUser , position: e.target.value })}
                />
                <Input
                  placeholder="Age"
                  value={newUser .age}
                  onChange={(e) => setNewUser ({ ...newUser , age: e.target.value })}
                />
                <Input
                  placeholder="Mobile"
                  value={newUser .mobile}
                  onChange={(e) => setNewUser ({ ...newUser , mobile: e.target.value })}
                />
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Select Allowed Pages:</h3>
                  <div className="flex flex-wrap">
                    {pages.map((page) => (
                      <label key={page} className="flex items-center w-1/2">
                        <input
                          type="checkbox"
                          checked={newUser .allowedPages.includes(page)}
                          onChange={() => {
                            const updatedPages = newUser .allowedPages.includes(page)
                              ? newUser .allowedPages.filter((p) => p !== page)
                              : [...newUser .allowedPages, page];
                            setNewUser ({ ...newUser , allowedPages: updatedPages });
                          }}
                        />
                        <span className="ml-2">{page}</span>
                      </label>
                    ))}
                  </div>
                </div>
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
        aria-label="Example table with custom cells, pagination and sorting"
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
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}