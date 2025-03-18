function overview(){
    return(
        <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Total Products</h3>
                    <Package className="text-blue-300" size={24} />
                  </div>
                  <p className="text-3xl font-bold mt-2">{products.length}</p>
                  <p className="text-blue-300 text-sm mt-2">+2 in the last 24 hours</p>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Verified Items</h3>
                    <CheckCircle className="text-indigo-300" size={24} />
                  </div>
                  <p className="text-3xl font-bold mt-2">{products.filter(p => p.status === 'Verified').length}</p>
                  <p className="text-indigo-300 text-sm mt-2">98% success rate</p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-900 to-purple-800 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Pending Compliance</h3>
                    <Clock className="text-purple-300" size={24} />
                  </div>
                  <p className="text-3xl font-bold mt-2">{products.filter(p => p.compliance === 'In Review' || p.compliance === 'Not Started').length}</p>
                  <p className="text-purple-300 text-sm mt-2">Average processing time: 2.4 hours</p>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
                <h3 className="text-xl font-medium mb-4">Blockchain Activity</h3>
                <div className="h-64 flex items-center justify-center">
                  {/* This would be replaced with an actual chart */}
                  <div className="text-center">
                    <BarChart2 size={64} className="mx-auto text-blue-400 mb-2" />
                    <p className="text-gray-400">Blockchain activity visualization would appear here</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-medium">Recent Products</h3>
                    <button className="text-blue-400 text-sm hover:underline">View All</button>
                  </div>
                  <div className="space-y-4">
                    {products.slice(0, 3).map(product => (
                      <div key={product.id} className="flex items-center p-3 bg-gray-750 rounded-lg">
                        <div className="mr-4">
                          <Package size={20} className="text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-400">ID: {product.id}</p>
                        </div>
                        <div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            product.status === 'Verified' ? 'bg-green-900 text-green-300' : 
                            product.status === 'Pending' ? 'bg-yellow-900 text-yellow-300' : 
                            'bg-red-900 text-red-300'
                          }`}>
                            {product.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                  <h3 className="text-xl font-medium mb-4">Compliance Status</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Passed</span>
                        <span className="text-sm text-green-400">
                          {products.filter(p => p.compliance === 'Passed').length} / {products.length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(products.filter(p => p.compliance === 'Passed').length / products.length) * 100}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">In Review</span>
                        <span className="text-sm text-yellow-400">
                          {products.filter(p => p.compliance === 'In Review').length} / {products.length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${(products.filter(p => p.compliance === 'In Review').length / products.length) * 100}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Failed</span>
                        <span className="text-sm text-red-400">
                          {products.filter(p => p.compliance === 'Failed').length} / {products.length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${(products.filter(p => p.compliance === 'Failed').length / products.length) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
    )
}

export default Overview;