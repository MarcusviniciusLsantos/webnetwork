import { memo } from "react";

function ErrorMarkIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14ZM9.59497 4.40503C9.86834 4.67839 9.86834 5.12161 9.59497 5.39497L7.98995 7L9.59497 8.60503C9.86834 8.87839 9.86834 9.32161 9.59497 9.59497C9.32161 9.86834 8.87839 9.86834 8.60503 9.59497L7 7.98995L5.39497 9.59497C5.12161 9.86834 4.67839 9.86834 4.40503 9.59497C4.13166 9.32161 4.13166 8.87839 4.40503 8.60503L6.01005 7L4.40503 5.39497C4.13166 5.12161 4.13166 4.67839 4.40503 4.40503C4.67839 4.13166 5.12161 4.13166 5.39497 4.40503L7 6.01005L8.60503 4.40503C8.87839 4.13166 9.32161 4.13166 9.59497 4.40503Z"
        fill="#EB5757"
      />
    </svg>
  );
}

export default memo(ErrorMarkIcon);
