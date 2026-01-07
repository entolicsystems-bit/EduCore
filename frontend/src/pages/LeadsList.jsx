import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { getLeads, deleteLead } from "../services/leadService"
import "./Leads.css";

const ITEMS_PER_PAGE = 8;
const MAX_VISIBLE_PAGES = 7;

const Leads = () => {
  const navigate = useNavigate();

  //state
  const [leads, setLeads] = useState([]);
  const [owners, setOwners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sourceFilter, setSourceFilter] = useState("ALL");
  const [ownerFilter, setOwnerFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const [openMenuId, setOpenMenuId] = useState(null);


    const loadLeads = async () => {
      try{
        const res = await getLeads();
        const data = res.data.data || res.data;

        setLeads(data);

    //  extract uniqueOwners
      const uniqueOwners = [
        ...new Set(data.map((lead) => lead.owner).filter(Boolean)),
      ];
      setOwners(uniqueOwners);
        } catch (error) {
          console.error("failed to load leads",error);
        }
      };

      /* LOAD LEADS FROM API */
  useEffect(() => {
    loadLeads() ;

    window.addEventListener("focus", loadLeads);
    return () => window.removeEventListener("focus", loadLeads);
  }, []);

  /* RESET PAGE ON FILTER CHANGE */
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, sourceFilter, ownerFilter, search]);
      // reset page on filter change

      useEffect(() => {
        setCurrentPage(1);
      }, [statusFilter, sourceFilter, ownerFilter, search]);

      // delete lead
      const handleDelete = async (id) => {
        if(!window("Are you sure you want to delete this lead?")) return;

        try{
          await deleteLead(id);
          setOpenMenuId(null);
          loadLeads();
        } catch (error) {
          alert("Failed to delete lead");
        }
      };


  // delete lead
  // const handleDelete = (id) => {
  //   if (!window.confirm("Are you sure you want to delete?")) return;

  //   setLeads((prev) => prev.filter((u) => u.id !== id));
  //   setOpenMenuId(null);
  // };

  /* FILTER */
  const filteredLeads = leads.filter((lead) => {
    const statusMatch =
      statusFilter === "ALL" || lead.status === statusFilter;

    const sourceMatch =
      sourceFilter === "ALL" || lead.source === sourceFilter;

    const ownerMatch =
      ownerFilter === "ALL" || lead.owner === ownerFilter;
    
    const statusMatch = statusFilter === "ALL" || lead.status === statusFilter;

    const sourceMatch = sourceFilter === "ALL" || lead.source === sourceFilter;

    const ownerMatch = ownerFilter === "ALL" || lead.owner === ownerFilter;

    const searchText = search.toLowerCase();
    const searchMatch =
      lead.name?.toLowerCase().includes(searchText) ||
      lead.email?.toLowerCase().includes(searchText);

    return statusMatch && sourceMatch && ownerMatch && searchMatch;
  });

  /* PAGINATION */
  const totalItems = filteredLeads.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentLeads = filteredLeads.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

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
              className="bg-[#0d99ff] text-white px-6 py-2 rounded-md cursor-pointer"

              className=" bg-[#0d99ff] text-white px-6 py-2 rounded-md cursor-pointer"
              onClick={() => navigate("/leads/create")}
            >
              Create Lead
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="filters bg-white">
          <select onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All Status</option>
            <option value="NEW">New</option>
            <option value="FOLLOW_UP">Follow Up</option>
            <option value="CONTACTED">Contacted</option>
          </select>

          <select onChange={(e) => setSourceFilter(e.target.value)}>
            <option value="ALL">All Sources</option>
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Social Media">Social Media</option>
            <option value="Email Campaign">Email Campaign</option>
          </select>

          <select
            value={ownerFilter}
            onChange={(e) => setOwnersFilter(e.target.value)}
          >
            <option value="ALL">All Owner</option>
            {owner.map((o, index) => (
              <option key={index} value={o}>
                {o}

            onChange={(e) => setOwnerFilter(e.target.value)}
          >
            <option value="ALL">All Owner</option>
            {owners.map((owner, index) => (
              <option key={index} value={owner}>
                {owner}

              </option>
            ))}
          </select>

          <input
            className="search-input"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>NAME</th>
                <th>PHONE</th>
                <th>SOURCE</th>
                <th>OWNER</th>
                <th>STATUS</th>
                <th></th>
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
                        {lead.owner?.charAt(0).toUpperCase()}
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
                        setOpenMenuId(
                          openMenuId === lead.id ? null : lead.id
                        );
                      }}
                    >
                      <i className="ri-more-2-fill"></i>
                    </button>

                    {openMenuId === lead.id && (
                      <div
                        className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() =>
                            navigate(`/users/edit/${lead.id}`)
                          }
                        >
                          ✏️ Edit
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {currentLeads.length === 0 && (
                <tr>
                  <td colSpan="6" className="no-data">
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
              onClick={() => setCurrentPage(currentPage - 1)}
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
              onClick={() => setCurrentPage(currentPage + 1)}
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
