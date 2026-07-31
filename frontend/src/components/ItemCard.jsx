import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import BorrowModal from './BorrowModal';
import EditItemModal from './EditItemModal';
import OptimizedImage from './OptimizedImage';

const ItemCard = React.memo(function ItemCard({ item, user, onStatusChange, index = 0 }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedItem, setEditedItem] = useState(null);

  const displayItem = editedItem || item;
  const isOwner = user && displayItem.ownerId && (displayItem.ownerId._id === user._id || displayItem.ownerId === user._id);

  const getStatusVariant = useCallback((status) => {
    switch (status) {
      case 'Available': return 'available';
      case 'Requested': return 'requested';
      case 'Borrowed': return 'destructive';
      default: return 'available';
    }
  }, []);

  const handleBorrowSuccess = useCallback(() => {
    setShowModal(false);
    if (onStatusChange) onStatusChange({ ...item, status: 'Requested' });
  }, [item, onStatusChange]);

  const handleEditSuccess = useCallback((updatedItem) => {
    setEditedItem(updatedItem);
    setShowEditModal(false);
    if (onStatusChange) onStatusChange(updatedItem);
  }, [onStatusChange]);

  return (
    <Card className="flex flex-col h-full overflow-hidden group">
      <CardContent className="flex-grow p-0">
        {/* Image with Cloudinary optimization */}
        <div className="relative overflow-hidden">
          <OptimizedImage
            src={displayItem.imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'}
            alt={displayItem.title}
            aspectRatio="10/7"
            width={500}
            crop="fill"
            gravity="auto"
            fetchpriority={index < 3 ? 'high' : 'low'}
            className="w-full transition-transform duration-300 group-hover:scale-[1.03]"
            imgClassName="transition-transform duration-300"
            objectFit="contain"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors pointer-events-none" />
          <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 flex gap-2">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm hover:bg-white/90 text-[11px] sm:text-xs">{displayItem.category}</Badge>
          </div>
          <div className="absolute bottom-2.5 sm:bottom-3 right-2.5 sm:right-3">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-[10px] sm:text-xs font-medium hover:bg-white/90">{displayItem.condition}</Badge>
          </div>
        </div>

        <div className="p-4 sm:p-5 flex flex-col gap-1.5 sm:gap-2">
          <div className="flex justify-between items-start gap-3">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary line-clamp-1">{displayItem.title}</h3>
            <Badge variant={getStatusVariant(displayItem.status)} className="shrink-0 text-[10px] sm:text-xs">{displayItem.status || 'Available'}</Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {displayItem.description}
          </p>
          
          {error && <div className="text-red-500 text-xs bg-red-50 p-2 rounded-md mt-1">{error}</div>}
        </div>
      </CardContent>

      <CardFooter className="p-4 sm:p-5 pt-0 mt-auto border-t border-border/50 flex-col gap-3 sm:gap-4">
        <div className="w-full flex justify-between items-center text-xs sm:text-sm pt-3 sm:pt-4">
          <span className="text-muted-foreground">Owner: <strong className="text-primary">{displayItem.ownerId?.name || 'Student'}</strong></span>
        </div>

        {isOwner ? (
          <Button variant="outline" className="w-full font-bold btn-standard text-xs sm:text-sm" onClick={() => setShowEditModal(true)}>
            Edit Listing
          </Button>
        ) : (
          <Button className="w-full font-bold btn-standard text-xs sm:text-sm" onClick={() => setShowModal(true)} disabled={loading}>
            {loading ? 'Requesting...' : 'Request to Borrow'}
          </Button>
        )}
      </CardFooter>

      {showModal && (
        <BorrowModal
          item={item}
          onClose={() => setShowModal(false)}
          onSuccess={handleBorrowSuccess}
        />
      )}

      {showEditModal && (
        <EditItemModal
          item={displayItem}
          user={user}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </Card>
  );
});

export default ItemCard;
