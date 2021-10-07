import {memo} from 'react';

function CrossArrow() {
  return (
    <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.1264 1.4373C11.1264 0.919645 11.5461 0.5 12.0637 0.5H17.0627C17.5804 0.5 18 0.919645 18 1.4373V6.43626C18 6.95392 17.5804 7.37357 17.0627 7.37357C16.545 7.37357 16.1254 6.95392 16.1254 6.43626V3.70016L1.60007 18.2255C1.23403 18.5915 0.640567 18.5915 0.274529 18.2255C-0.0915096 17.8594 -0.0915096 17.266 0.274529 16.8999L14.7999 2.37461H12.0637C11.5461 2.37461 11.1264 1.95496 11.1264 1.4373Z" fill="#4250E4"/>
      <path d="M17.0745 11.9502C17.5857 11.9502 18 12.3501 18 12.8434V17.6069C18 18.1001 17.5857 18.5 17.0745 18.5H12.1387C11.6276 18.5 11.2132 18.1001 11.2132 17.6069C11.2132 17.1136 11.6276 16.7137 12.1387 16.7137H14.8403L10.7711 12.5247C10.4097 12.1759 10.4097 11.6104 10.7711 11.2616C11.1325 10.9128 11.7185 10.9128 12.0799 11.2616L16.1491 15.4506V12.8434C16.1491 12.3501 16.5634 11.9502 17.0745 11.9502Z" fill="#4250E4"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M0.300546 0.778947C0.694645 0.400707 1.32614 0.408047 1.71102 0.795341L7.21616 6.33493C7.60105 6.72222 7.59358 7.34281 7.19948 7.72105C6.80538 8.09929 6.17389 8.09195 5.789 7.70466L0.283864 2.16507C-0.101022 1.77778 -0.0935529 1.15719 0.300546 0.778947Z" fill="#4250E4"/>
    </svg>
  )
}

export default memo(CrossArrow);
