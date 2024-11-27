import { useState } from "react";
import { ScanLine, Dot, Bell, ChevronDown } from "lucide-react";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import toast from "react-hot-toast";

const Header = ({ address }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const wallets = [
    {
      name: "Wallet 1",
      address: "5F7UbQsP.....aWt3i1K4s",
      balance: "1.23 ETH",
    },
    {
      name: "Wallet 2",
      address: "3H8UbQsP.....YaWt3i1K4s",
      balance: "0.75 ETH",
    },
    {
      name: "Wallet 3",
      address: "2J8UbQsPcJ....KuYaWt3i1K4s",
      balance: "2.50 ETH",
    },
  ];

  // Function to copy the address to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard!");
  };

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Trim the address for display
  // const trimmedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <header className="shadow-md px-6 py-4 flex justify-between items-center">
      <ScanLine className="text-green-500" />
      <p className="flex items-center font-medium text-gray-600">
        <Dot className="text-green-500 mr-2" />
        <span
          className="text-gray-500 cursor-pointer"
          onClick={copyToClipboard}
        >
          Wallet ({address})
        </span>
        <ChevronDown className="ml-2 cursor-pointer" onClick={openModal} />
      </p>
      <Bell className="text-green-500 hover:text-gray-600 transition-colors cursor-pointer" />

      {/* Modal */}
      {isModalOpen && (
        <Modal
          show={openModal}
          size="md"
          onClose={() => setIsModalOpen(false)}
          popup
        >
          <Modal.Header size="sm" />
          <Modal.Body>
            <div className="max-w-md mx-auto p-4">
              <h2 className="text-xl font-semibold mb-4">Select a Wallet</h2>
              <ul className="space-y-2">
                {wallets.map((wallet, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-2 border-b last:border-b-0"
                  >
                    <div>
                      <h3 className="font-medium">{wallet.name}</h3>
                      <p className="text-gray-500 text-sm">{wallet.address}</p>
                    </div>
                    <span className="text-gray-700 font-semibold">
                      {wallet.balance}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </header>
  );
};

export default Header;
