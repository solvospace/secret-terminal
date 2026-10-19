"use client";

import { Spinner } from "@/components/ui/spinner";
import { FaReddit, FaGithub } from "react-icons/fa";
import { ExternalLink } from "lucide-react";
import { formatValueIntoCommaSeparated } from "@secret-terminal/services/utils.service";
import { ClientCoinProperties } from "@secret-terminal/types/coin-details.types";

type Bindings = {
    fetchingCoinDetails: boolean;
    coinDetails: ClientCoinProperties | null;
};

export default function CoinDetailsBlock(bindings: Bindings) {
    const { fetchingCoinDetails, coinDetails } = bindings;

    return (
        <div className="coin-details-wrapper">
            {fetchingCoinDetails ? (
                <div className="w-max mx-auto">
                    <Spinner className="size-8" />
                </div>
            ) : (
                <>
                    {coinDetails ? (
                        <div>
                            {coinDetails.description && (
                                <div className="text-[13px] mb-[12px]">{coinDetails.description}</div>
                            )}

                            {(coinDetails.websiteUrl || coinDetails.socialLinks || coinDetails.currentPrice) && (
                                <table className="st-table">
                                    <tbody>
                                        {coinDetails.websiteUrl && (
                                            <tr>
                                                <td>Website</td>
                                                <td>
                                                    <a
                                                        href={coinDetails.websiteUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center"
                                                    >
                                                        {new URL(coinDetails.websiteUrl).hostname.replace("www.", "")}
                                                        <ExternalLink className="ml-[4px] size-3" />
                                                    </a>
                                                </td>
                                            </tr>
                                        )}

                                        {coinDetails.socialLinks && coinDetails.socialLinks.length > 0 && (
                                            <tr>
                                                <td>Socials</td>
                                                <td>
                                                    <div className="social-container">
                                                        {coinDetails.socialLinks.map((socialLink, index) => {
                                                            return (
                                                                <a
                                                                    key={`${index}-${socialLink.name}`}
                                                                    className="social-link-chip"
                                                                    href={socialLink.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <div className="icon">
                                                                        {socialLink.name === "Github" && (
                                                                            <FaGithub
                                                                                name="github"
                                                                                size={17}
                                                                            />
                                                                        )}
                                                                        {socialLink.name === "Reddit" && (
                                                                            <FaReddit
                                                                                name="reddit"
                                                                                size={17}
                                                                            />
                                                                        )}
                                                                    </div>

                                                                    <div className="name">{socialLink.name}</div>
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}

                                        {coinDetails.currentPrice && (
                                            <tr>
                                                <td>Current Price</td>
                                                <td>
                                                    {formatValueIntoCommaSeparated(coinDetails.currentPrice, 5, true)}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    ) : (
                        <div className="no-value-text !text-center">No details available</div>
                    )}
                </>
            )}
        </div>
    );
}
