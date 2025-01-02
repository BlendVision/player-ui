/* @jsxImportSource @emotion/react */
import {FormattedMessage} from './intl'
import icons from './icons'
import {Button, Tooltip, Switch} from './buttons'

const menuItemStyle = {
  marginTop: '2px',
  padding: '1em 1.5em',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',

  '::after': {
    content: '" "',
    width: '1.5em',
    height: '1.5em',
    display: 'inline-block',
    color: 'white',
    maskSize: 'cover',
    backgroundRepeat: 'no-repeat',
  },
}

const hasNextLevelStyle = {
  '::after': {
    backgroundImage: `url(${icons.arrowTop})`,
    transform: 'rotate(90deg)',
  },
}

const checkedStyle = {
  color: 'white',
  '::after': {
    backgroundColor: 'var(--primary-highlight, white)',
    maskImage: `url(${icons.check})`,
  },
}

const MenuItemText = ({text = ''}) => (
  <FormattedMessage
    id={text}
    defaultMessage={
      <FormattedMessage id={`KKS.SETTING.${text}`} defaultMessage={text} />
    }
  />
)

const MenuItem = ({type = 'has-next', label, value, checked, onClick}) => (
  <li
    role={type === 'radio' ? 'menuitemradio' : 'menuitem'}
    aria-checked={checked}
    css={[
      menuItemStyle,
      type === 'has-next' && hasNextLevelStyle,
      type === 'switch' && {'::after': {width: '0'}},
      checked && checkedStyle,
    ]}
    key={label}
    onClick={onClick}
  >
    <MenuItemText text={label} />
    <div css={{flex: 1}} />
    {value && <MenuItemText text={value.toString()} />}
    {type === 'switch' && <Switch checked={checked} />}
  </li>
)

const menuContainerStyle = {
  height: '100%',
  overflow: 'auto',
  background: 'inherit',
  button: {fontSize: '1em', marginRight: '0.5em'},
  h2: {
    position: 'sticky',
    top: 0,
    marginBlockStart: 0,
    marginBlockEnd: 0,
    padding: '0.66em 1em',
    display: 'flex',
    alignItems: 'center',
    background: 'inherit',
  },
}

const MenuContainer = ({style, children}) => (
  <div css={[menuContainerStyle, style]}>{children}</div>
)

const SpeedButton = ({value, onClick}) => (
  <Tooltip title="KKS.SETTING.SPEED">
    <Button onClick={onClick}>
      {value}
      <span css={{fontSize: '75%'}}>x</span>
    </Button>
  </Tooltip>
)

const SpeedList = ({
  selected,
  items = ['0.25', '0.5', '0.75', '1', '1.25', '1.5', '1.75', '2'],
  onChange,
  onClose,
} = {}) => (
  <MenuContainer>
    <h2>
      {onClose && <Button startIcon="chevronLeft" onClick={onClose} />}
      <FormattedMessage id="KKS.SETTING.SPEED" />
    </h2>
    {items.map(speed => (
      <MenuItem
        type="radio"
        label={`${speed}x`}
        checked={speed === selected}
        onClick={() => {
          onChange(speed)
          onClose?.()
        }}
      />
    ))}
  </MenuContainer>
)

export {MenuContainer, MenuItem, SpeedButton, SpeedList}
