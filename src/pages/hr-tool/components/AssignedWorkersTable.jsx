const AssignedWorkersTable = ({ workers, onRemove }) => (
  <div className="card p-5">
    <h3 className="font-black mb-3">Assigned Workers</h3>

    {workers.map(id => (
      <div key={id} className="flex justify-between py-2 border-b">
        <span>Worker #{id}</span>
        <button
          onClick={() => onRemove(id)}
          className="text-red-600 font-bold"
        >
          Remove
        </button>
      </div>
    ))}
  </div>
);

export default AssignedWorkersTable;