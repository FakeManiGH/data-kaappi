import { groupDescRegex, groupNameRegex } from "@/utils/Regex";


// Validate group-data
export const validateGroupdata = (data) => {
    let errors = {};
    
    if (!data.groupName || data.groupName.trim() === "") {
        errors.name = 'Ryhmällä on olatava nimi.';
    } else if (!groupNameRegex.test(data.groupName)) {
        errors.name = 'Ryhmän nimen tulee olla 4-50 merkkiä pitkä, eikä se saa sisältää <, >, /, \\ -merkkejä.'
    }

    if (!data.groupDesc || data.groupDesc.length > 400) {
        errors.desc = 'Kuvauksen tulee olla 0-400 merkkiä pitkä.'
    } else if (!groupDescRegex.test(data.groupDesc)) {
        errors.desc = 'Ryhmän kuvauksen tulee olla 0-400 merkkiä pitkä, eikä se saa sisältää <, >, /, \\ -merkkejä.'
    }

    if (data.groupVisibility !== 'private' && data.groupVisibility !== 'public') {
        errors.visibility = 'Virheellinen ryhmän näkyvyys.'
    }

    if (data.pwdProtected) {
        if (!data.groupPwd || data.groupPwd.trim() === "") {
            errors.pwd = 'Salasana ei voi olla tyhjä.';
        } 
    }

    return errors;
}