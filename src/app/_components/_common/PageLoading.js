

const PageLoading = () => {
    return (
      <div className="mx-auto w-full max-w-sm p-6">  
        <div className="flex animate-pulse space-x-4">    
          <div className="size-20 rounded-full bg-contrast"></div>    
          <div className="flex-1 space-y-6 py-1">      
            <div className="h-2 rounded bg-contrast"></div>     
            <div className="space-y-3">       
              <div className="grid grid-cols-3 gap-4">          
                <div className="col-span-2 h-2 rounded bg-contrast"></div>          
                <div className="col-span-1 h-2 rounded bg-contrast"></div>       
              </div>        
              <div className="h-2 rounded bg-contrast"></div>      
            </div>    
          </div>  
        </div>
      </div>
    );
};

export default PageLoading;