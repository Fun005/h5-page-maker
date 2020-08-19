import Text from './text'
import imageSrc from './imageSrc'
import longImageSrc from './longImageSrc'
import imageSrcList from './imageSrcList'
import Url from './url'
import musicSrc from './musicSrc'
import placeholder from './placeholder'
import rows from './rows'
import richText from './richText'
import configBtn from './configBtn'
import Radio from './radio'
import Number from './number'
import Color from './color'

export default {
	[Text.name]: Text,
	[imageSrc.name]: imageSrc,
	[longImageSrc.name]: longImageSrc,
	[Url.name]: Url,
	[musicSrc.name]: musicSrc,
	[imageSrcList.name]: imageSrcList,
	[placeholder.name]: placeholder,
	[rows.name]: rows,
	[richText.name]: richText,
	[configBtn.name]: configBtn,
	[Radio.name]: Radio,
	[Number.name]: Number,
	[Color.name]: Color,
}
