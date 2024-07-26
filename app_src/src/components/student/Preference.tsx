import React from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { IPreference } from "../../interfaces";

const Preference = ({
  pref,
  onPrefUp,
  onPrefDown,
}: {
  pref: IPreference;
  onPrefUp: any;
  onPrefDown: any;
}) => {
  const handleUp = () => {
    onPrefUp(pref.id);
  };

  const handleDown = () => {
    onPrefDown(pref.id);
  };

  return (
    <tr className="">
      <td>
        <span>{pref.university}</span>
      </td>
      <td className="align-middle">
        <span>{pref.course}</span>
      </td>
      <td className="align-middle">
        <span className="">
          {pref.rank && pref.rank > 0 ? pref.rank : pref.enrolled}/{pref.capacity}
        </span>
      </td>
      <td className="align-middle">
        <span className="text-success p-1" onClick={handleUp}>
          <FaArrowUp size={24} />
        </span>
        <span className="text-danger p-1" onClick={handleDown}>
          <FaArrowDown size={24} />
        </span>
      </td>
    </tr>
  );
};

export default Preference;
