import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((item: T, index: number) => string);
  emptyMessage?: string;
  onRowClick?: (item: T, index: number) => void;
  renderActions?: (item: T, index: number) => ReactNode;
}

export const Table = <T extends Record<string, any>>({
  columns,
  data,
  className = "",
  headerClassName = "",
  rowClassName = "",
  emptyMessage = "No data available",
  onRowClick,
  renderActions,
}: TableProps<T>) => {
  const getRowClassName = (item: T, index: number): string => {
    if (typeof rowClassName === "function") {
      return rowClassName(item, index);
    }
    return rowClassName;
  };

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full border-collapse" data-testid="table">
        <thead>
          <tr
            className={`border-b border-GREY-100 ${headerClassName}`}
            data-testid="table-header"
          >
            {columns.map((column) => (
              <th
                key={column.key}
                className={`text-left bg-GREY-800 font-sans py-4 px-2 text-sm font-normal text-NEUTRAL-1000 ${column.headerClassName || ""}`}
              >
                {column.header}
              </th>
            ))}
            {renderActions && (
              <th className="text-left bg-GREY-800 py-4 px-2 text-sm font-normal text-GREY-200 w-10"></th>
            )}
          </tr>
        </thead>
        <tbody data-testid="table-body">
          {data?.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (renderActions ? 1 : 0)}
                className="text-center font-sans py-8 text-NEUTRAL-1200"
                data-testid="empty-message"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data?.map((item, index) => (
              <tr
                key={index}
                className={`border-b border-GREY-100 hover:bg-GREY-100/20 transition-colors ${getRowClassName(item, index)} ${onRowClick ? "cursor-pointer" : ""}`}
                onClick={() => onRowClick?.(item, index)}
                data-testid={`table-row-${index}`}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`py-4 px-2 text-sm font-sans text-NEUTRAL-1200 ${column.className || ""}`}
                  >
                    {column.render
                      ? column.render(item, index)
                      : (item[column.key as keyof T] as ReactNode)}
                  </td>
                ))}
                {renderActions && (
                  <td className="py-4 px-2 text-sm text-NEUTRAL-100">
                    {renderActions(item, index)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
