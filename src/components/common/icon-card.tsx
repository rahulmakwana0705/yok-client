import Link from "@components/ui/link";
import Text from "@components/ui/text";
import { FaLink } from "react-icons/fa";
import { LinkProps } from "next/link";
import { useTranslation } from "next-i18next";
import cn from "classnames";

interface Props {
	item: any;
	effectActive?: boolean;
	variant?: "default" | "modern" | "circle" | "list";
	href: LinkProps["href"];
}

const IconCard: React.FC<Props> = ({
	item,
	effectActive = false,
	variant = "default",
	href,
}) => {
	const { name, icon, tags, productCount } = item ?? {};
	const { t } = useTranslation("common");

	return (
		<Link
			href={href}
			className={cn(
				"group flex justify-center items-center rounded-lg relative",
				{
					"flex-col sm:h-[8.5rem] md:h-40 xl:h-[11.5rem] 2xl:h-44 3xl:h-60 w-40 h-36":
						variant === "default",
					"flex-col px-4 lg:px-6 pt-5 lg:pt-7 pb-4 lg:pb-5 w-40 h-36":
						variant === "modern",
					"flex-col items-center": variant === "circle",
					"gap-[20px] xl:gap-[25px] 2xl:gap-[30px] 3xl:gap-[40px] px-2 lg:px-3 py-4 lg:py-5 w-40 h-36":
						variant === "list",
				}
			)}
		>
			{/* <div
				className={cn(" flex items-center", {
					"mb-2 md:mb-3 lg:mb-4 xl:mb-2 2xl:mb-5 3xl:mb-6 lg:h-20 mx-auto":
						variant === "default",
					"ltr:mr-auto rtl:ml-auto h-12": variant === "modern",
					"bg-gray-200 justify-center rounded-full mb-2 md:mb-3 lg:mb-4 w-[90px] md:w-28 lg:w-[120px] xl:w-36 h-[90px] md:h-28 lg:h-[120px] xl:h-36 max-w-full":
						variant === "circle",
					"flex-shrink-0": variant === "list",
				})}
			> */}
			<img
				src={icon}
				alt={name || t("text-card-thumbnail")}
				className={cn("mb-0 object-contain", {
					"mx-auto mb-2 sm:mb-3 w-full h-full": variant === "default",
					"mb-2 sm:mb-3 w-full h-full": variant === "modern",
					"transform scale-[0.6] lg:scale-65 2xl:scale-80 3xl:scale-85 w-full h-full":
						variant === "circle",
					"mx-auto w-full h-full": variant === "list",
				})}
			/>
			{/* {effectActive === true && variant === "circle" && (
					<>
						<div className="absolute top-0 left-0 bg-black w-full h-full opacity-0 transition-opacity duration-300 group-hover:opacity-30 rounded-full" />
						<div className="absolute top-0 left-0 h-full w-full flex items-center justify-center rounded-full">
							<FaLink className="text-white text-base sm:text-xl lg:text-2xl xl:text-3xl transform opacity-0 scale-0 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:scale-100" />
						</div>
					</>
				)} */}
			{/* </div> */}

			{effectActive === true && variant !== "circle" && (
				<>
					<div className="absolute top-0 left-0 bg-black h-full opacity-0 transition-opacity duration-300 group-hover:opacity-30  rounded-lg w-40 border" />
					<div className="absolute top-0 left-0 h-full flex items-center justify-center  rounded-lg w-40">
						<FaLink className="text-white text-base sm:text-xl lg:text-2xl xl:text-3xl transform opacity-0 scale-0 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:scale-100" />
					</div>
				</>
			)}
		</Link>
	);
};

export default IconCard;
