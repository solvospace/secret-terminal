import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Dispatch, memo, SetStateAction } from "react";
import { Spinner } from "@/components/ui/spinner";
import { NewsArticle } from "@/interfaces/news.interface";
import useNews from "@/hooks/use-news";

type Bindings = {
    showDialog: boolean;
    setShowDialog: Dispatch<SetStateAction<boolean>>;
};

export default memo(function NewsDialog(bindings: Bindings) {
    const { showDialog, setShowDialog } = bindings;
    const { articles, fetchingLatestNews } = useNews({ showDialog });

    return (
        <Dialog
            open={showDialog}
            onOpenChange={setShowDialog}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>News</DialogTitle>

                    <DialogDescription className="text-[11px] m-[4px_0px] sr-only">news dialog</DialogDescription>
                </DialogHeader>

                <DialogBody>
                    {fetchingLatestNews === true ? (
                        <Spinner className="size-8 m-[10px_auto]" />
                    ) : articles && articles.length > 0 ? (
                        <div className="article-list">
                            {articles.map((article: NewsArticle, index) => {
                                return (
                                    <a
                                        key={article.id}
                                        className="article"
                                        href={article.url}
                                        target="_blank"
                                    >
                                        <div className="details">
                                            <div className="source-info text-[13px]">
                                                {article.source.icon && (
                                                    <img
                                                        className="icon"
                                                        src={article.source.icon}
                                                    />
                                                )}

                                                <span className="name">{article.source.name}</span>
                                            </div>

                                            <div className="text-[13px]">{article.title}</div>
                                        </div>

                                        <div className="article-image">
                                            <img src={article.imageUrl} />
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="no-value-text !text-center">No articles</div>
                    )}
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
});
