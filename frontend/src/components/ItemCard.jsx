import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import BorrowModal from './BorrowModal';
import EditItemModal from './EditItemModal';

const ItemCard = ({ item, user, onStatusChange }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedItem, setEditedItem] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const displayItem = editedItem || item;
  const isOwner = user && displayItem.ownerId && (displayItem.ownerId._id === user._id || displayItem.ownerId === user._id);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Available': return 'available';
      case 'Requested': return 'requested';
      case 'Borrowed': return 'destructive';
      default: return 'available';
    }
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden group">
      <CardContent className="flex-grow p-0">
        <div className="relative w-full h-52 bg-muted overflow-hidden">
          <img
            src={displayItem.imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'}
            alt={displayItem.title}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';
              setImageLoaded(true);
            }}
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm hover:bg-white/90">{displayItem.category}</Badge>
          </div>
          <div className="absolute bottom-3 right-3">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-xs font-medium hover:bg-white/90">{displayItem.condition}</Badge>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-2">
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-xl font-bold text-primary line-clamp-1">{displayItem.title}</h3>
            <Badge variant={getStatusVariant(displayItem.status)}>{displayItem.status || 'Available'}</Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {displayItem.description}
          </p>
          
          {error && <div className="text-red-500 text-xs bg-red-50 p-2 rounded-md mt-2">{error}</div>}
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 mt-auto border-t border-border/50 flex-col gap-4">
        <div className="w-full flex justify-between items-center text-sm pt-4">
          <span className="text-muted-foreground">Owner: <strong className="text-primary">{displayItem.ownerId?.name || 'Student'}</strong></span>
        </div>

        {isOwner ? (
          <Button variant="outline" className="w-full font-bold" onClick={() => setShowEditModal(true)}>
            Edit Listing
          </Button>
        ) : (
          <Button className="w-full font-bold" onClick={() => setShowModal(true)} disabled={loading}>
            {loading ? 'Requesting...' : 'Request to Borrow'}
          </Button>
        )}
      </CardFooter>

      {showModal && (
        <BorrowModal
          item={item}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            if (onStatusChange) onStatusChange({ ...item, status: 'Requested' });
          }}
        />
      )}

      {showEditModal && (
        <EditItemModal
          item={displayItem}
          user={user}
          onClose={() => setShowEditModal(false)}
          onSuccess={(updatedItem) => {
            setEditedItem(updatedItem);
            setShowEditModal(false);
            if (onStatusChange) onStatusChange(updatedItem);
          }}
        />
      )}
    </Card>
  );
};

export default ItemCard;
