import { Link } from "react-router-dom";
import { Footer, Navbar } from "../components";
import { AiOutlinePlus } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { setFeedback } from "../context/actions/feedbackActions";
import { useEffect, useState } from "react";
import { getFeedbackWithUser } from "../api";
import { Cloud } from "../assets";
import { Steps } from "rsuite";

function Feedbacks() {
  const user = useSelector((state) => state?.user?.user);
  const feedback = useSelector((state) => state?.feedback?.feedback);

  const dispatch = useDispatch();

  const [searchInput, setSearchInput] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);

  const statusOptions = [
    "Not Verify",
    "Validating",
    "Verified",
    "Processing",
    "Fixed",
  ];

  const loadData = async () => {
    try {
      const data = await getFeedbackWithUser(user?.uid);
      dispatch(setFeedback(data));
    } catch (error) {
      console.error("Error loading feedback:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, [dispatch, user?.uid]);

  function handleInputChange(e) {
    setSearchInput(e.target.value);
  }

  function handleStatusClick(status) {
    setSelectedStatus(status === "All" ? null : status);
  }

  const filteredFeedbacks = feedback
    ? feedback.filter(
        (item) =>
          (selectedStatus ? item.status.Status === selectedStatus : true) &&
          item.title.toLowerCase().includes(searchInput.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex bg-gray-50 pb-5">
        <div className="w-full md:w-4/5 lg:w-3/5 md:mx-auto md:max-w-4xl p-4">
          <div className="pt-4 pb-0">
            <div className="flex">
              <h2 className="flex-grow text-gray-900 text-2xl font-semibold">
                Your Feedbacks
              </h2>
              <Link
                to={"/create-feedback"}
                className="v-btn py-2 px-4
        bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200
        text-white transition ease-in duration-200 text-center text-base font-medium focus:outline-none focus:ring-2
        focus:ring-offset-2 rounded-lg flex items-center hover:no-underline"
              >
                <span className="no-underline mx-auto flex items-center">
                  <AiOutlinePlus className="mr-2 text-xl" />
                  Create a new feedback
                </span>
              </Link>
            </div>
            <small className="flex text-gray-500">
              Manage your feedbacks and submissions.
            </small>
          </div>
        </div>
      </div>
      <div className="flex bg-white">
        <div className="w-full md:w-4/5 lg:w-3/5 md:mx-auto md:max-w-4xl px-4">
          <div className="mt-8 pb-0">
            <div className="mb-6 relative">
              <div className="text-gray-700 font-semibold text-sm">
                Search a feedback
              </div>
              <div className="flex items-center justify-center gap-3 w-full h-full px-4 rounded-md border-gray-300 border bg-white">
                <input
                  type="text"
                  placeholder="Name of feedback to search"
                  value={searchInput}
                  onChange={handleInputChange}
                  className="flex-1 w-full h-full py-2 outline-none border-none bg-transparent text-text555 text-sm"
                />
              </div>
              <div className="flex mt-4 mb-4 space-x-4">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    className={`py-2 px-4 bg-gray-200 hover:bg-gray-300 focus:ring-blue-500 focus:ring-offset-blue-200
                   text-gray-500 transition ease-in duration-200 text-center text-base font-medium 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg 
                   ${
                     selectedStatus === status
                       ? "bg-blue-500 text-gray-950"
                       : ""
                   }`}
                    onClick={() => handleStatusClick(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* my form  */}
              <div className="mb-10">
                {filteredFeedbacks && filteredFeedbacks.length > 0 ? (
                  filteredFeedbacks.map((item) => (
                    <div key={item.feedbackId}>
                      <div className="mt-4 p-4 flex group bg-white hover:bg-gray-50">
                        <div className="flex-grow items-center truncate cursor-pointer">
                          <span className="font-semibold text-gray-900 text-xl">
                            {item.title}
                          </span>
                          <div className="flex items-center justify-between">
                            <ul className="flex text-gray-500">
                              <li className="pr-1">Status</li>
                              <li className="list-disc ml-6 pr-1">
                                {item.status.Status}
                              </li>
                              <li className="list-disc ml-6">
                                Created:{" "}
                                {new Date(item.createdAt).toLocaleString()}
                              </li>
                            </ul>
                            <div className="border border-gray-300 hover:bg-gray-200 px-3 py-2 rounded-lg">
                              <BsThreeDots />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mx-4">
                        <Steps
                          current={statusOptions.indexOf(item.status.Status)}
                        >
                          <Steps.Item
                            title="Send Feedback"
                            description="Feedback have been send"
                            status={
                              statusOptions.indexOf(item.status.Status) >= -1
                                ? "finish"
                                : "wait"
                            }
                          />
                          <Steps.Item
                            title={
                              item.status.Status === "Reject"
                                ? "Reject"
                                : "Validating"
                            }
                            description={
                              item.status.Status === "Validating"
                                ? "We are validating"
                                : item.status.Status === "Reject"
                                ? "We are sorry, your request has been rejected."
                                : statusOptions.indexOf(item.status.Status) >= 1
                                ? "We are validating"
                                : null
                            }
                            status={
                              item.status.Status === "Validating"
                                ? "process"
                                : item.status.Status === "Reject"
                                ? "error"
                                : statusOptions.indexOf(item.status.Status) >= 1
                                ? "finish"
                                : "wait"
                            }
                          />
                          <Steps.Item
                            title="Verified"
                            description={
                              statusOptions.indexOf(item.status.Status) >= 2
                                ? "We are validated"
                                : null
                            }
                            status={
                              statusOptions.indexOf(item.status.Status) >= 2
                                ? "finish"
                                : "wait"
                            }
                          />
                          <Steps.Item
                            title="Processing"
                            description={
                              statusOptions.indexOf(item.status.Status) >= 3
                                ? "We are processing"
                                : null
                            }
                            status={
                              statusOptions.indexOf(item.status.Status) >= 3
                                ? "finish"
                                : "wait"
                            }
                          />
                          <Steps.Item
                            title="Fixed"
                            description={
                              statusOptions.indexOf(item.status.Status) >= 4
                                ? "We are Fixed"
                                : null
                            }
                            status={
                              item.status.Status === "Fixed"
                                ? statusOptions.indexOf(item.status.Status) >= 4
                                  ? "finish"
                                  : "process"
                                : "wait"
                            }
                          />
                        </Steps>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    {/* not feedback  */}
                    <div className="flex bg-white">
                      <div className="w-full md:w-4/5 lg:w-3/5 md:mx-auto md:max-w-4xl px-4">
                        <div className="mt-8 pb-0">
                          <div className="flex flex-wrap justify-center max-w-4xl">
                            <img src={Cloud} alt="cloud" className="w-56" />
                            <h3 className="w-full mt-4 text-center text-gray-900 font-semibold">
                              No feedback found
                            </h3>
                            <Link
                              to={"/create-feedback"}
                              className="py-2 px-4
                              bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200
                              text-white transition ease-in duration-200 text-center text-base font-medium focus:outline-none focus:ring-2
                                focus:ring-offset-2 rounded-lg flex items-center hover:no-underline"
                            >
                              <span className="no-underline mx-auto flex items-center">
                                <AiOutlinePlus className="mr-2 text-xl" />
                                Create a new feedback
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Feedbacks;
