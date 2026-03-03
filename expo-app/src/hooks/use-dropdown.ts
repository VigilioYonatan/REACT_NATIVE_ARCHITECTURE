import { useState } from "react";

export default function useDropdown() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const onOpenClose = () => setDropdownOpen((prev) => !prev);
    const onClose = () => setDropdownOpen(false);
    return { dropdownOpen, onOpenClose, onClose };
}
