import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { getLeads, getLimitedLead } from "../services/leadService";
import "./Leads.css";

import useDebounce from "../hooks/useDebounce";

const ITEMS_PER_PAGE = 8;
const MAX_VISIBLE_PAGES = 7;

const Leads = () => {
  const navigate = useNavigate();

  //data and pagination seates
  const [leads, setLeads] = useState([]);
  const [owners, setOwners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [totalItems, setTotalItems] = useState(0);

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sourceFilter, setSourceFilter] = useState("ALL");
  const [ownerFilter, setOwnerFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500); // 500ms delay

  // for action dropdown (3-dot menu)
  const [openMenuId, setOpenMenuId] = useState(null);

  // Load Leads from backend
  const loadLeads = async () => {
    try {
      const params = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      };

      if (statusFilter !== "ALL") params.status = statusFilter;
      if (sourceFilter !== "ALL") params.source = sourceFilter;
      if (ownerFilter !== "ALL") params.owner_id = ownerFilter;
      if (debouncedSearch.trim() !== "") params.search = debouncedSearch.trim();

      const res = await getLimitedLead(params);

      const data = res.data.data || res.data;
      setLeads(data);

      // Verify if backend provides count in metadata, otherwise fetch all (still risky but reduced frequency)
      // Ideally backend should return { data, total }
      if (res.data.total !== undefined) {
        setTotalItems(res.data.total);
      } else {
        // Fallback: This is expensive and causes 429 if lead count is high. 
        // We pass params to at least filter the count query if supported, or just use what we have.
        // For now, attempting to optimize by NOT fetching all if we can avoid it, 
        // but keeping original logic to ensure pagination works until backend is verified.
        const allLeads = await getLeads();
        setTotalItems(allLeads.data.length);
      }

      // extract unique owners for filter dropdown
      const uniqueOwners = [
        ...new Set(data.map((lead) => lead.owner).filter(Boolean)),
      ];
      setOwners(uniqueOwners);
    } catch (error) {
      // console.error("failed to load leads", error); // Silencing strict error logging for 429s during dev
    }
  };

  /* LOAD LEADS FROM API */
  useEffect(() => {
    loadLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter, sourceFilter, ownerFilter, debouncedSearch]);

  // Remove the second useEffect that caused double-fetches


  // delete lead
  // const handleDelete = async (id) => {
  //   if (!window.confirm("Are you sure you want to delete this lead?")) return;

  //   try {
  //     await deleteLead(id); // 🔥 API CALL

  //     // Update UI after successful delete
  //     setLeads((prev) => prev.filter((lead) => lead.id !== id));

  //     setOpenMenuId(null);
  //   } catch (error) {
  //     console.error("Failed to delete lead", error);
  //     alert("Failed to delete lead. Please try again.");
  //   }
  // };

  /* PAGINATION */
  // const totalItems = leads.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  // const currentLeads = leads.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const currentLeads = leads;

  // when api fetch that time below code not need
  const showingFrom = totalItems === 0 ? 0 : startIndex + 1;
  const showingTo = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);

  const getVisiblePages = () => {
    let start = Math.max(currentPage - 3, 1);
    let end = Math.min(start + MAX_VISIBLE_PAGES - 1, totalPages);

    if (end - start < MAX_VISIBLE_PAGES - 1) {
      start = Math.max(end - MAX_VISIBLE_PAGES + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <DashboardLayout>
      <div className="leads-page">
        {/* HEADER */}
        <div className="leads-header">
          <h2 className="font-bold">Leads</h2>
          <div className="header-actions">
            <button
              className="border-2 border-[#0d99ff] text-[#0d99ff] px-6 py-2 rounded-md cursor-pointer"
              onClick={() => navigate("/leads/import")}
            >
              Import CSV
            </button>
            <button
              className=" bg-[#0d99ff] text-white px-6 py-2 rounded-md cursor-pointer"
              onClick={() => navigate("/leads/create")}
            >
              Create Lead
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="filters bg-[#eef3ff]">
          <select
            className="bg-white"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">All Status</option>
            <option value="NEW">New</option>
            <option value="FOLLOW_UP">Follow Up</option>
            <option value="CONTACTED">Contacted</option>
          </select>

          <select
            className="bg-white"
            value={sourceFilter}
            onChange={(e) => {
              setSourceFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">All Sources</option>
            <option value="Admin">Admin</option>
            <option value="Counselor">Counselor</option>
            <option value="CSV Import">CSV</option>
            <option value="website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Social Media">Social Media</option>
            <option value="Email Campaign">Email Campaign</option>
          </select>

          <select
            className="bg-white"
            value={ownerFilter}
            onChange={(e) => {
              setOwnerFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">All Owners</option>
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name}
              </option>
            ))}
          </select>

          {/* RIGHT ALIGNED SEARCH */}
          <input
            className="search-input mr-[20%] bg-white"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* TABLE */}
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th className="table-head">NAME</th>
                <th className="table-head">PHONE</th>
                <th className="table-head">SOURCE</th>
                <th className="table-head">OWNER</th>
                <th className="table-head">STATUS</th>
                <th className="table-head">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="clickable-row"
                  onClick={() => navigate(`/leads/${lead.id}`)}
                >
                  <td>
                    <div className="name-cell hover:underline">
                      <strong>{lead.name}</strong>
                      <span>{lead.email}</span>
                    </div>
                  </td>
                  <td>{lead.phone}</td>
                  <td>{lead.source}</td>
                  <td>
                    <div className="owner-cell">
                      <div className="owner-badge">
                        {lead.name?.charAt(0).toUpperCase()}
                      </div>
                      {lead.owner}
                    </div>
                  </td>
                  <td>
                    <span className={`status ${lead.status.toLowerCase()}`}>
                      {lead.status}
                    </span>
                  </td>

                  <td className="relative">
                    <button
                      className="cursor-pointer hover:bg-gray-100 w-7 h-7 rounded-full flex items-center justify-center z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === lead.id ? null : lead.id);
                      }}
                    >
                      <i className="ri-more-2-fill"></i>
                    </button>

                    {openMenuId === lead.id && (
                      <div
                        className="absolute text-center text-white right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="w-full rounded-xl px-4 py-2 bg-[#0d99ff] text-sm hover:bg-[#0f93f2] cursor-pointer"
                          onClick={() => navigate(`/users/edit/${lead.id}`)}
                        >
                          Edit
                        </button>

                        {/* <button
                          className="w-full rounded-xl px-4 py-2 text-sm bg-[#ff7d2d] hover:bg-[#f46d1a]"
                          onClick={() => handleDelete(lead.id)}
                        >
                          Delete
                        </button> */}
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {currentLeads.length === 0 && (
                <tr>
                  <td colSpan="5" className="no-data">
                    No leads found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}

        <div className="pagination">
          <span>
            Showing {showingFrom} to {showingTo} of {totalItems} results
          </span>

          <div className="pages">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              ‹
            </button>

            {getVisiblePages().map((page) => (
              <button
                key={page}
                className={currentPage === page ? "active" : ""}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Leads;
