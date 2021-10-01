import React, { SVGProps, memo } from "react";

function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="57" height="52" viewBox="0 0 57 52" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.796 2.13023C17.0184 0.946424 18.6663 0.289551 20.375 0.289551H40.375C40.7645 0.289551 41.1387 0.441053 41.4185 0.712013L56.4185 15.2383C56.7103 15.5209 56.875 15.9097 56.875 16.3159V45.3685C56.875 47.0663 56.1781 48.6845 54.954 49.8699C53.7316 51.0537 52.0837 51.7106 50.375 51.7106H20.375C16.8423 51.7106 13.875 48.9051 13.875 45.3685V6.63166C13.875 4.93381 14.5719 3.31563 15.796 2.13023ZM20.375 3.28955C19.4315 3.28955 18.5359 3.65297 17.883 4.28531C17.2317 4.91606 16.875 5.76109 16.875 6.63166V45.3685C16.875 47.1582 18.4077 48.7106 20.375 48.7106H50.375C51.3185 48.7106 52.2141 48.3472 52.867 47.7148C53.5183 47.0841 53.875 46.2391 53.875 45.3685V17.4339C53.6055 17.6749 53.2519 17.8159 52.875 17.8159H40.375C39.5466 17.8159 38.875 17.1443 38.875 16.3159V4.2106C38.875 3.86974 38.9904 3.54759 39.1911 3.28955H20.375ZM41.875 7.75133V14.8159H49.1699L41.875 7.75133ZM23.875 18.7369C23.875 17.9085 24.5466 17.2369 25.375 17.2369H30.375C31.2034 17.2369 31.875 17.9085 31.875 18.7369C31.875 19.5653 31.2034 20.2369 30.375 20.2369H25.375C24.5466 20.2369 23.875 19.5653 23.875 18.7369ZM23.875 28.4211C23.875 27.5927 24.5466 26.9211 25.375 26.9211H45.375C46.2034 26.9211 46.875 27.5927 46.875 28.4211C46.875 29.2496 46.2034 29.9211 45.375 29.9211H25.375C24.5466 29.9211 23.875 29.2496 23.875 28.4211ZM23.875 38.1053C23.875 37.2769 24.5466 36.6053 25.375 36.6053H45.375C46.2034 36.6053 46.875 37.2769 46.875 38.1053C46.875 38.9338 46.2034 39.6053 45.375 39.6053H25.375C24.5466 39.6053 23.875 38.9338 23.875 38.1053Z" fill="#20222B"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M16.3472 12.0005C9.59707 12.0005 4.125 17.4726 4.125 24.2227C4.125 30.9729 9.59707 36.4449 16.3472 36.4449C19.6344 36.4449 22.6185 35.1472 24.8151 33.0362C24.8649 32.9726 24.919 32.9114 24.9775 32.8529C25.0359 32.7945 25.0971 32.7404 25.1607 32.6906C27.2717 30.494 28.5694 27.5099 28.5694 24.2227C28.5694 17.4726 23.0973 12.0005 16.3472 12.0005ZM29.1453 34.1923C31.291 31.4418 32.5694 27.9815 32.5694 24.2227C32.5694 15.2634 25.3065 8.00049 16.3472 8.00049C7.38792 8.00049 0.125 15.2634 0.125 24.2227C0.125 33.182 7.38792 40.4449 16.3472 40.4449C20.106 40.4449 23.5663 39.1665 26.3169 37.0208L32.7108 43.4147C33.4918 44.1958 34.7582 44.1958 35.5392 43.4147C36.3203 42.6337 36.3203 41.3673 35.5392 40.5863L29.1453 34.1923Z" fill="#434758"/>
    </svg>
  );
}

export default memo(SearchIcon);
