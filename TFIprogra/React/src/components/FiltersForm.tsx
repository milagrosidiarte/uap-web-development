import { useFilterStore } from "../store/useFilterStore";

export function FiltersForm() {
  const { filter, setFilter } = useFilterStore();

  return (
    <form method="GET" className="flex justify-center gap-2 mt-5" name="filter-form">
      <button type="submit" className="px-4 py-2 bg-[#b07c7c] rounded-[5px] text-white text-[16px] cursor-pointer" name="filter" value="all" onClick={(e) => {
        e.preventDefault()
        setFilter("all")
      }}>All</button>
      <button type="submit" className="px-4 py-2 bg-[#b07c7c] rounded-[5px] text-white text-[16px] cursor-pointer" name="filter" value="incomplete" onClick={(e) => {
        e.preventDefault()
        setFilter("incomplete")
      }}>Incomplete</button>
      <button type="submit" className="px-4 py-2 bg-[#b07c7c] rounded-[5px] text-white text-[16px] cursor-pointer" name="filter" value="completed" onClick={(e) => {
        e.preventDefault()
        setFilter("completed")
      }}>Completed</button>
    </form>
  );
}