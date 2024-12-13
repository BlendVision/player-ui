import { useContext, createContext } from "react";

const Langs = {
  en: 'en',
  ja: 'ja',
  zh: 'zh-TW',
  "zh-tw": 'zh-TW',
};

export const context = createContext();

const useTranslations = () => useContext(context).translations;

const translate = (translations, { id, values, getDefault }) => {
  if (id in translations) {
    return translations[id].replace(/{(\S+?)}/gi, (_, key) => {
      const res = values[key] || "";
      return res?.join(", ") || res;
    });
  }
  return getDefault?.() || id;
};

const getLocale = () =>
  typeof navigator !== "undefined" && navigator.language?.slice(0, 2);

const IntlProvider = ({
  locale = getLocale() || "en",
  messages = {},
  children,
}) => {
  const translations = Object.assign({}, Langs[locale.toLowerCase()], messages);
  const formatMessage = (descriptor = "", values) =>
    (translations[descriptor?.id || descriptor] || "").replace(
      /{(\S+?)}/gi,
      (substring, name) => [].concat(values[name] ?? substring).join(", ")
    ) ||
    descriptor.defaultMessage ||
    descriptor.id ||
    "";
  const intl = {
    formatMessage,
    translate: formatMessage,
    getMessage: formatMessage,
  };

  return <context.Provider value={intl}>{children}</context.Provider>;
};

const useIntl = () => useContext(context);

const FormattedMessage = ({ id, defaultMessage, values }) => {
  const intl = useIntl();
  if (!intl) {
    console.warn(
      `<FormattedMessage id="${id}" defaultMessage="${defaultMessage}"> is used without context`,
      values
    );
    return "";
  }
  return intl.formatMessage({ id, defaultMessage }, values);
};

const padTime = (value) => Math.floor(value).toString().padStart(2, "0");

const formatTime = (sourceTime) => {
  const sign = sourceTime < 0 ? "-" : "";
  const time = Math.abs(sourceTime || 0, 0);
  const seconds = padTime(time % 60);
  const minutes = padTime((time / 60) % 60);
  const hours = Math.floor(time / 60 / 60);

  return sign + [hours, minutes, seconds].filter(Boolean).join(":");
};

const FormattedTime = ({ time }) => {
  const intl = useIntl() || {};
  return (intl.formatTime || formatTime)(time);
};

export { FormattedMessage, FormattedTime, useIntl, IntlProvider };
export { useTranslations, translate };
