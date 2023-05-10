import MediumCard from './MediumCard';

const Features = () => {
    const cardsData = [{"img":"https://links.papareact.com/2io","title":"Risk Assessment"},{"img":"https://links.papareact.com/q7j","title":"Privacy Advice"},{"img":"https://links.papareact.com/s03","title":"DPIA"},{"img":"https://links.papareact.com/8ix","title":"AI DPO"}]

	return (
		<div className="relative h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px]">
            <main className="px-8 mx-auto max-w-7xl sm:px-16">
                <section>
                    <h2 className="py-8 text-4xl font-semibold">Key Fatures</h2>
                    <div className="flex p-3 -ml-3 space-x-3 overflow-scroll scrollbar-hide">
                        {cardsData?.map(
                            ({ img, title }: { img: string; title: string }) => (
                                <MediumCard key={img} img={img} title={title} />
                            )
                        )}
                    </div>
                </section>	
            </main>	
		</div>
	);
};

export default Features;